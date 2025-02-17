import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "./Input";

const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePassword = () => setShowPassword(prev => !prev);
  
  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      iconRight={
        <span
          onClick={togglePassword}
          style={{ cursor: "pointer" }}
        >
          {showPassword ? (
            <FaEyeSlash style={{ color: "var(--primary-text)" }} />
          ) : (
            <FaEye style={{ color: "var(--primary-text)" }} />
          )}
        </span>
      }
    />
  );
};

export default PasswordInput;
