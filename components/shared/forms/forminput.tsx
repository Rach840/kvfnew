"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "../../../src/shared/ui/input";
import { ClearButton } from "../../../src/shared/ui/clear-button";
import { ErrorText } from "../../../src/shared/ui/error-text";
import { RequiredSymbol } from "../../../src/shared/ui/required-symbol";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
}

export const FormInput: React.FC<Props> = ({
  className,
  name,
  label,
  required,
  defaultValue,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <div className={className}>
      {label && (
        <p className="font-medium mb-2">
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className="relative">
        <Input
          defaultValue={defaultValue ? defaultValue : ""}
          className="h-12 text-md"
          {...register(name)}
          {...props}
        />
        {value && <ClearButton onClick={onClickClear} />}
      </div>

      {errorText && <ErrorText text={errorText} className="mt-2" />}
    </div>
  );
};
