import { ComboItem } from "@workspace/ui/types/combo-item";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "../field";
import { RadioGroup, RadioGroupItem } from "../radio-group";

type props = {
  items: ComboItem[];
  label: string;
  name: string;
  description?: string;
  defaultValue?: string;
};

/**
 * Render a labeled choice card containing horizontal radio options for selecting one item.
 *
 * @param items - Array of options to display; each item provides a label, value, and selection display text
 * @param label - Visible label for the radio group
 * @param name - HTML name/id base for the group
 * @param description - If provided, displays an explanatory line above the options
 * @param defaultValue - Value of the option that should be selected by default
 * @returns The rendered choice card JSX element
 */
export function FormChoiceCard({
  items,
  label,
  name,
  description,
  defaultValue,
}: props) {
  return (
    <div className="w-full max-w-md">
      <FieldGroup>
        <FieldSet>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          {description && (
            <FieldDescription>
              Select the compute environment for your cluster.
            </FieldDescription>
          )}
          <RadioGroup defaultValue={defaultValue}>
            {items.map((item) => (
              <FieldLabel htmlFor={item.value} key={item.value}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{item.label}</FieldTitle>
                    <FieldDescription>{item.selectionDisplay}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={item.value} id={item.value} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}