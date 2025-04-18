import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Separator } from "@workspace/ui/components/separator";
import { formatPhoneNumber } from "@workspace/ui/lib/formatPhoneNumber";

import { PayloadProcessingAccount } from "@/types/payload-api-response-types";
import {
  PayloadProcessingAccountStatusLabels,
  PayloadProcessingAccountStatusType,
} from "@/types/payload-processing-account-status";
import { Icons } from "@/components/icons";

import { getProcessingAccountStatusColor } from "../../utils/get-processing-account-status-color";

type props = {
  account: PayloadProcessingAccount;
};


/**
 * Dialog component displaying detailed information about a processing account.
 * Shows account information, status badge, billing contact, legal entity, and processing settings.
 *
 * @param props - Component properties
 * @param props.account - The processing account object containing detailed information to display
 * @returns A React Dialog component for viewing those processing account details
 */

export function PayerProcessingAccountDetailsDialog({ account }: props) {
  const statusColor = getProcessingAccountStatusColor(
    account.status as PayloadProcessingAccountStatusType,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icons.eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <DialogTitle className="text-xl font-semibold">
              Processing Account Details
            </DialogTitle>
            <Badge className={statusColor} variant="outline">
              {
                PayloadProcessingAccountStatusLabels[
                  account.status as PayloadProcessingAccountStatusType
                ]
              }
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Account Info Section */}
            <section>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Account Information
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Name</p>
                  <p>{account.name}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Industry</p>
                  <p>{account.industry}</p>
                </div>
              </div>
            </section>

            <Separator className="my-2" />

            {/* Billing Contact Section */}
            <section>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Billing Contact
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Name</p>
                  <p>{account.billing_contact.name}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Email</p>
                  <p>{account.billing_contact.email}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Phone</p>
                  <p>{formatPhoneNumber(account.billing_contact.phone)}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-muted-foreground">Address</p>
                  <p>
                    {account.billing_contact.street_address1}
                    {account.billing_contact.street_address2 &&
                      `, ${account.billing_contact.street_address2}`}
                    <br />
                    {account.billing_contact.city},{" "}
                    {account.billing_contact.state_province}{" "}
                    {account.billing_contact.postal_code}
                  </p>
                </div>
              </div>
            </section>

            <Separator className="my-2" />

            {/* Legal Entity Section */}
            <section>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Legal Entity
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">
                    Legal Name
                  </p>
                  <p>{account.legal_entity.legal_name}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">EIN</p>
                  <p>{account.legal_entity.ein}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    Entity Type
                  </p>
                  <p>{account.legal_entity.type}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    Incorporated In
                  </p>
                  <p>{account.legal_entity.state_incorporated}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-muted-foreground">Address</p>
                  <p>
                    {account.legal_entity.street_address}
                    {account.legal_entity.unit_number &&
                      `, ${account.legal_entity.unit_number}`}
                    <br />
                    {account.legal_entity.city},{" "}
                    {account.legal_entity.state_province}{" "}
                    {account.legal_entity.postal_code}
                  </p>
                </div>
              </div>
            </section>

            <Separator className="my-2" />

            {/* Processing Settings Section */}
            <section>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Processing Settings
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">
                    Integration Type
                  </p>
                  <p>{account.processing_settings.integration_type}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Currency</p>
                  <p>{account.processing_settings.currency}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    Bank Processing
                  </p>
                  <p>
                    {account.processing_settings.bank_account_processing_enabled
                      ? "Yes"
                      : "No"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
