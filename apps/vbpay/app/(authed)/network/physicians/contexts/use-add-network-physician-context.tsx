"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { fetchNppesApiResponseAction } from "@/actions/fetch-nppes-api-response-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import {
  Resolver,
  SubmitHandler,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";

import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { useDidMountEffect } from "@workspace/ui/hooks/use-did-mount-effect";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { NppesApiResponseResult } from "@/types/nppes-api-reponse";
import { newPubId } from "@/lib/nanoid";
import {
  NppesNetworkPhysicianSearchFormDefaultValues,
  NppesNetworkPhysicianSearchFormInput,
  NppesNetworkPhysicianSearchFormSchema,
} from "@/components/nppes-network-physician-search-form/nppes-network-physician-search-form-schema";

import { insertNetworkPhysicianAction } from "../actions/insert-network-physician-action";
import {
  AddNetworkPhysicianFormDefaultValues,
  AddNetworkPhysicianFormInput,
  AddNetworkPhysicianFormOutput,
  AddNetworkPhysicianFormSchema,
} from "../components/add-network-physician-form/add-network-physician-form-schema";

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_SEARCH_LENGTH = 2;
const NPI_LENGTH = 10;
const MIN_ZIP_LENGTH = 4;

// Types
type SheetState = "search" | "advanced" | "form";

type FormValidationFields = {
  npi: boolean;
  firstName: boolean;
  lastName: boolean;
  city: boolean;
  state: boolean;
  zip: boolean;
  taxonomy: boolean;
};

type AddNetworkPhysicianContextType = {
  // Form Management
  addNetworkPhysicianForm: UseFormReturn<
    AddNetworkPhysicianFormInput,
    AddNetworkPhysicianFormOutput
  >;
  onSubmitAddNetworkPhysicianForm: SubmitHandler<AddNetworkPhysicianFormInput>;
  isAddNetworkPhysicianFormSubmitting: boolean;

  // Step Management
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;

  // Error Handling
  isErrorDialogOpen: boolean;
  errorMsg?: string;
  errorTitle?: string;
  closeErrorDialog: () => void;

  // Reference Data
  pos: ComboItem[];
  practices: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];

  // NPPES Search
  nppesSearchForm: UseFormReturn<NppesNetworkPhysicianSearchFormInput>;
  handleNppesSelection: (data: AddNetworkPhysicianFormInput) => void;
  nppesApiResponseData: NppesApiResponseResult[] | undefined;
  isNppesSearchPending: boolean;

  // Sheet Management
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  sheetState: SheetState;
  setSheetState: (state: SheetState) => void;
};

const AddNetworkPhysicianContext =
  createContext<AddNetworkPhysicianContextType | null>(null);

type props = {
  children: React.ReactNode;
  pos: ComboItem[];
  practices: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
};

export function AddNetworkPhysicianProvider({
  children,
  pos,
  practices,
  facilities,
  vendors,
}: props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<"search" | "advanced" | "form">(
    "search",
  );

  const [nppesApiResponseData, setNppesApiResponseData] = useState<
    NppesApiResponseResult[]
  >([]);

  const nppesSearchForm = useForm<NppesNetworkPhysicianSearchFormInput>({
    resolver: zodResolver(NppesNetworkPhysicianSearchFormSchema),
    defaultValues: NppesNetworkPhysicianSearchFormDefaultValues,
  });

  // Use explicit typing for the form hook
  const addNetworkPhysicianForm = useForm<AddNetworkPhysicianFormInput>({
    resolver: zodResolver(
      AddNetworkPhysicianFormSchema,
    ) as Resolver<AddNetworkPhysicianFormInput>,
    defaultValues: AddNetworkPhysicianFormDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const resetAllForms = useCallback(() => {
    setCurrentStep(1);
    setSheetState("search");
    addNetworkPhysicianForm.reset(AddNetworkPhysicianFormDefaultValues);
    nppesSearchForm.reset(NppesNetworkPhysicianSearchFormDefaultValues);
    setNppesApiResponseData([]);
  }, [addNetworkPhysicianForm, nppesSearchForm]);

  const handleSheetOpenChange = useCallback(
    (open: boolean) => {
      setSheetOpen(open);
      if (!open) {
        resetAllForms();
      }
    },
    [resetAllForms],
  );

  const handleNppesSelection = useCallback(
    (data: AddNetworkPhysicianFormInput) => {
      const formData = addNetworkPhysicianForm.getValues();
      const newFormData: AddNetworkPhysicianFormInput = {
        ...formData,
        physInfo: {
          ...formData.physInfo,
          npi: data.physInfo.npi,
          firstName: data.physInfo.firstName,
          lastName: data.physInfo.lastName,
          specialty: data.physInfo.specialty,
          primaryTaxonomyCode: data.physInfo.primaryTaxonomyCode,
          credential: data.physInfo.credential,
          soleProprietor: data.physInfo.soleProprietor,
        },
      };
      addNetworkPhysicianForm.reset(newFormData);

      if (sheetState === "advanced") {
        setSheetState("search");
      }
    },
    [addNetworkPhysicianForm, sheetState],
  );

  const nppesNpi = useWatch({
    control: nppesSearchForm.control,
    name: "npi",
  });
  const physNpi = useWatch({
    control: addNetworkPhysicianForm.control,
    name: "physInfo.npi",
  });
  const watchIndividualNpi = sheetState === "advanced" ? nppesNpi : physNpi;

  const nppesFirstName = useWatch({
    control: nppesSearchForm.control,
    name: "firstName",
  });
  const physFirstName = useWatch({
    control: addNetworkPhysicianForm.control,
    name: "physInfo.firstName",
  });
  const watchFirstName =
    sheetState === "advanced" ? nppesFirstName : physFirstName;

  const nppesLastName = useWatch({
    control: nppesSearchForm.control,
    name: "lastName",
  });
  const physLastName = useWatch({
    control: addNetworkPhysicianForm.control,
    name: "physInfo.lastName",
  });
  const watchLastName =
    sheetState === "advanced" ? nppesLastName : physLastName;

  const nppesCity = useWatch({
    control: nppesSearchForm.control,
    name: "city",
  });
  const watchCity = sheetState === "advanced" ? nppesCity : "";

  const nppesState = useWatch({
    control: nppesSearchForm.control,
    name: "state",
  });
  const watchState = sheetState === "advanced" ? nppesState : "";

  const nppesZip = useWatch({
    control: nppesSearchForm.control,
    name: "zip",
  });
  const watchZip = sheetState === "advanced" ? nppesZip : "";

  const nppesTaxonomy = useWatch({
    control: nppesSearchForm.control,
    name: "taxonomy",
  });
  const physTaxonomy = useWatch({
    control: addNetworkPhysicianForm.control,
    name: "physInfo.primaryTaxonomyCode",
  });
  const watchTaxonomyDesc =
    sheetState === "advanced" ? nppesTaxonomy : physTaxonomy;

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
    execute: execInsertNetworkPhysicianAction,
    isPending: isInsertNetworkPhysicianPending,
  } = useAction(insertNetworkPhysicianAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The physician has been created successfully.",
      });
      handleSheetOpenChange(false);
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

  function onSubmit(formData: AddNetworkPhysicianFormInput) {
    // Transform the input data to match the expected output
    const transformedData: AddNetworkPhysicianFormOutput = {
      ...formData,
      physInfo: {
        ...formData.physInfo,
        // Ensure soleProprietor is either "yes" or "no"
        soleProprietor:
          formData.physInfo.soleProprietor === ""
            ? "no"
            : formData.physInfo.soleProprietor,
      },
    } as AddNetworkPhysicianFormOutput;

    execInsertNetworkPhysicianAction({
      payerPubId: payerPubId || "",
      formData: transformedData,
      revalidationPath,
    });
  }

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await addNetworkPhysicianForm.trigger(fields);
    if (isValid) {
      const nextStep = Math.min(currentStep + 1, 3);
      if (
        currentStep === 1 &&
        (sheetState === "advanced" || sheetState === "search")
      ) {
        setSheetState("form");
      }
      setCurrentStep(nextStep);
    }
  };

  const prevStep = () => {
    const nextStep = Math.max(currentStep - 1, 1);
    if (nextStep === 1 && sheetState !== "search") {
      setSheetState("search");
    }
    setCurrentStep(nextStep);
  };

  // Utility functions
  const getFieldsForStep = (
    step: number,
  ): Array<keyof AddNetworkPhysicianFormInput> => {
    switch (step) {
      case 1:
        return ["physInfo"];
      case 2:
        return ["affInfo"];
      default:
        return [];
    }
  };

  const validateSearchFields = (fields: {
    npi?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    zip?: string;
    taxonomy?: string;
  }): FormValidationFields => {
    return {
      npi: Boolean(fields.npi?.length === NPI_LENGTH),
      firstName: Boolean((fields.firstName?.length ?? 0) > MIN_SEARCH_LENGTH),
      lastName: Boolean((fields.lastName?.length ?? 0) > MIN_SEARCH_LENGTH),
      city: Boolean((fields.city?.length ?? 0) > MIN_SEARCH_LENGTH),
      state: Boolean((fields.state?.length ?? 0) > 1),
      zip: Boolean((fields.zip?.length ?? 0) > MIN_ZIP_LENGTH),
      taxonomy: Boolean((fields.taxonomy?.length ?? 0) > MIN_SEARCH_LENGTH),
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
      npi: watchIndividualNpi,
      firstName: watchFirstName,
      lastName: watchLastName,
      city: watchCity,
      state: watchState,
      zip: watchZip,
      taxonomy: watchTaxonomyDesc,
    };

    const validationResults = validateSearchFields(searchFields);

    if (hasValidSearchCriteria(validationResults)) {
      setSearch(newPubId());
    } else {
      setNppesApiResponseData([]);
    }
  }, [
    watchIndividualNpi,
    watchFirstName,
    watchLastName,
    watchCity,
    watchState,
    watchZip,
    watchTaxonomyDesc,
  ]);

  useDidMountEffect(() => {
    if (debouncedValue === "") {
      return;
    }
    execNppesSearchAction({
      npiType: "individual",
      npi: watchIndividualNpi || undefined,
      firstName: watchFirstName || undefined,
      lastName: watchLastName || undefined,
      city: watchCity || undefined,
      state: watchState || undefined,
      zip: watchZip || undefined,
      taxonomy: watchTaxonomyDesc || undefined,
    });
  }, [debouncedValue]);

  // Create the context value with explicit typing
  const contextValue: AddNetworkPhysicianContextType = {
    addNetworkPhysicianForm,
    onSubmitAddNetworkPhysicianForm: onSubmit,
    currentStep,
    nextStep,
    prevStep,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    isAddNetworkPhysicianFormSubmitting: isInsertNetworkPhysicianPending,
    pos,
    practices,
    facilities,
    vendors,
    handleNppesSelection,
    sheetOpen,
    setSheetOpen: handleSheetOpenChange,
    sheetState,
    setSheetState,
    nppesSearchForm,
    nppesApiResponseData: nppesApiResponseData,
    isNppesSearchPending,
  };

  return (
    <AddNetworkPhysicianContext.Provider value={contextValue}>
      {children}
    </AddNetworkPhysicianContext.Provider>
  );
}

export function useAddNetworkPhysicianContext() {
  const context = useContext(AddNetworkPhysicianContext);
  if (!context) {
    throw new Error(
      "useAddNetworkPhysicianContext must be used within AddNetworkPhysicianProvider",
    );
  }
  return context;
}
