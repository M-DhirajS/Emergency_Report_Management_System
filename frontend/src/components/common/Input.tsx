interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
}: InputProps) {
  return (
    <div className="mb-5">
      <label className="block font-semibold mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}

export default Input;