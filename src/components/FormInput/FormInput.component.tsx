import { FormInputProps } from './FormInput.types';

export default function FormInput({
  labelName,
  htmlFor,
  onChange,
  value,
  id,
  type,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={`
          mt-2 block
          text-left
        `}
      >
        {labelName}
      </label>
      <input
        onChange={onChange}
        value={value}
        id={id}
        type={type || 'text'}
        className={`
          my-2 w-full rounded-md border-2 border-gray-300
          px-2 py-1
          text-left focus:bg-violet-100 
        `}
      />
    </div>
  );
}
