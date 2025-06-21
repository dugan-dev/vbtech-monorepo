"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { fetchNppesApiResponseAction } from "@/actions/fetch-nppes-api-response-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { useDidMountEffect } from "@workspace/ui/hooks/use-did-mount-effect";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { newPubId } from "@workspace/ui/lib/nanoid";

import { NppesApiResponseResult } from "@/types/nppes-api-reponse";
import {
  NppesNetworkEntitySearchFormDefaultValues,
  NppesNetworkEntitySearchFormInput,
  NppesNetworkEntitySearchFormSchema,
} from "@/components/nppes-network-entity-search-form/nppes-network-entity-search-form-schema";

import { insertNetworkEntityAction } from "../actions/insert-network-entity-action";
import {
  AddNetworkEntityFormDefaultValues,
  AddNetworkEntityFormInput,
  AddNetworkEntityFormOutput,
  AddNetworkEntityFormSchema,
} from "../components/add-network-entity-form/add-network-entity-form-schema";

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_SEARCH_LENGTH = 2;
const NPI_LENGTH = 10;
const MIN_ZIP_LENGTH = 4;

// Types
type SheetState = "search" | "advanced";

type FormValidationFields = {
  orgNpi: boolean;
  orgName: boolean;
  city: boolean;
  state: boolean;
  zip: boolean;
};

type AddNetworkEntityContextType = {
  // Form Management
  addNetworkEntityForm: UseFormReturn<AddNetworkEntityFormInput>;
  onSubmitAddNetworkEntityForm: SubmitHandler<AddNetworkEntityFormInput>;
  isAddNetworkEntityFormSubmitting: boolean;

  // Error Handling
  isErrorDialogOpen: boolean;
  errorMsg?: string;
  errorTitle?: string;
  closeErrorDialog: () => void;

  // NPPES Search
  nppesSearchForm: UseFormReturn<NppesNetworkEntitySearchFormInput>;
  nppesSearchSelection: AddNetworkEntityFormInput;
  setNppesSearchSelection: (data: AddNetworkEntityFormInput) => void;
  nppesApiResponseData: NppesApiResponseResult[] | undefined;
  isNppesSearchPending: boolean;

  // Sheet Management
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  sheetState: SheetState;
  setSheetState: (state: SheetState) => void;
};

const AddNetworkEntityContext =
  createContext<AddNetworkEntityContextType | null>(null);

type props = {
  children: React.ReactNode;
};

export function AddNetworkEntityProvider({ children }: props) {
  "use no memo";
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<"search" | "advanced">("search");

  const resetAllForms = () => {
    setSheetState("search");
    addNetworkEntityForm.reset(AddNetworkEntityFormDefaultValues);
    nppesSearchForm.reset(NppesNetworkEntitySearchFormDefaultValues);
    setNppesSearchSelection(AddNetworkEntityFormDefaultValues);
    setNppesApiResponseData([]);
  };

  useEffect(() => {
    if (!sheetOpen) {
      resetAllForms();
    }
  }, [sheetOpen, resetAllForms]);

  const [nppesSearchSelection, setNppesSearchSelection] =
    useState<AddNetworkEntityFormInput>(AddNetworkEntityFormDefaultValues);
  const [nppesApiResponseData, setNppesApiResponseData] = useState<
    NppesApiResponseResult[]
  >([]);

  useEffect(() => {
    if (nppesSearchSelection.orgNpi !== "") {
      const formData = addNetworkEntityForm.getValues();
      const newFormData: AddNetworkEntityFormInput = {
        ...formData,
        marketingName: nppesSearchSelection.marketingName,
        orgNpi: nppesSearchSelection.orgNpi,
      };
      addNetworkEntityForm.reset(newFormData);
      if (sheetState === "advanced") {
        setSheetState("search");
      }
    }
  }, [nppesSearchSelection]);

  const nppesSearchForm = useForm<NppesNetworkEntitySearchFormInput>({
    resolver: zodResolver(NppesNetworkEntitySearchFormSchema),
    defaultValues: NppesNetworkEntitySearchFormDefaultValues,
  });

  const addNetworkEntityForm = useForm<AddNetworkEntityFormInput>({
    resolver: zodResolver(AddNetworkEntityFormSchema),
    defaultValues: nppesSearchSelection ?? AddNetworkEntityFormDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const watchOrgNpi =
    sheetState === "advanced"
      ? nppesSearchForm.watch("orgNpi")
      : addNetworkEntityForm.watch("orgNpi");
  const watchOrgName =
    sheetState === "advanced"
      ? nppesSearchForm.watch("entityName")
      : addNetworkEntityForm.watch("marketingName");
  const watchCity =
    sheetState === "advanced" ? nppesSearchForm.watch("city") : "";
  const watchState =
    sheetState === "advanced" ? nppesSearchForm.watch("state") : "";
  const watchZip =
    sheetState === "advanced" ? nppesSearchForm.watch("zip") : "";

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const searchParams = useSearchParams();
  const payerPubId = searchParams.get("pId") as string;

  const revalidationPath = usePathname();

  const {
    execute: execInsertNetworkEntityAction,
    isPending: isInsertNetworkEntityPending,
  } = useAction(insertNetworkEntityAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The network entity has been created successfully.",
      });
      resetAllForms();
      setSheetOpen(false);
    },
    onError: ({ error }) => {
      openErrorDialog(
        "Error",
        error.validationErrors
          ? `Invalid inputs. Please double check the data and try again. If the problem persists please contact support. ${JSON.stringify(error)}`
          : error.serverError
            ? error.serverError
            : (error as string),
      );
    },
  });

  const { execute: execNppesSearchAction, isPending: isNppesSearchPending } =
    useAction(fetchNppesApiResponseAction, {
      onSuccess: ({ data: nppesResponseData }) => {
        setNppesApiResponseData(nppesResponseData?.results ?? []);
      },
      onError: ({ error }) => {
        openErrorDialog(
          "Error",
          error.validationErrors
            ? "Invalid inputs. Please double check the data and try again. If the problem persists please contact support."
            : error.serverError
              ? error.serverError
              : (error as string),
        );
      },
    });

  function onSubmit(formData: AddNetworkEntityFormOutput) {
    execInsertNetworkEntityAction({
      payerPubId: payerPubId || "",
      formData,
      revalidationPath,
    });
  }

  const validateSearchFields = (fields: {
    orgNpi?: string;
    entityName?: string;
    city?: string;
    state?: string;
    zip?: string;
  }): FormValidationFields => {
    return {
      orgNpi: Boolean(fields.orgNpi?.length === NPI_LENGTH),
      orgName: Boolean(fields.entityName?.length ?? 0 > MIN_SEARCH_LENGTH),
      city: Boolean(fields.city?.length ?? 0 > MIN_SEARCH_LENGTH),
      state: Boolean(fields.state?.length ?? 0 > 1),
      zip: Boolean(fields.zip?.length ?? 0 > MIN_ZIP_LENGTH),
    };
  };

  const hasValidSearchCriteria = (
    validationFields: FormValidationFields,
  ): boolean => {
    return Object.values(validationFields).some((field) => field === true);
  };

  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, DEBOUNCE_DELAY);

  useDidMountEffect(() => {
    const searchFields = {
      orgNpi: watchOrgNpi,
      entityName: watchOrgName,
      city: watchCity,
      state: watchState,
      zip: watchZip,
    };

    const validationResults = validateSearchFields(searchFields);

    if (hasValidSearchCriteria(validationResults)) {
      setSearch(newPubId());
    } else {
      setNppesApiResponseData([]);
    }
  }, [watchOrgNpi, watchOrgName, watchCity, watchState, watchZip]);

  useDidMountEffect(() => {
    if (debouncedValue === "") {
      return;
    }
    execNppesSearchAction({
      npiType: "organization",
      npi: watchOrgNpi || undefined,
      orgName: watchOrgName || undefined,
      city: watchCity || undefined,
      state: watchState || undefined,
      zip: watchZip || undefined,
    });
  }, [debouncedValue]);

  return (
    <AddNetworkEntityContext.Provider
      value={{
        addNetworkEntityForm,
        onSubmitAddNetworkEntityForm:
          onSubmit as SubmitHandler<AddNetworkEntityFormInput>,
        isErrorDialogOpen,
        errorMsg,
        errorTitle,
        closeErrorDialog,
        isAddNetworkEntityFormSubmitting: isInsertNetworkEntityPending,
        setNppesSearchSelection,
        sheetOpen,
        setSheetOpen,
        sheetState,
        setSheetState,
        nppesSearchSelection,
        nppesSearchForm,
        nppesApiResponseData: nppesApiResponseData,
        isNppesSearchPending,
      }}
    >
      {children}
    </AddNetworkEntityContext.Provider>
  );
}

export function useAddNetworkEntityContext() {
  const context = useContext(AddNetworkEntityContext);
  if (!context) {
    throw new Error(
      "useAddNetworkEntityContext must be used within AddNetworkEntityProvider",
    );
  }
  return context;
}
