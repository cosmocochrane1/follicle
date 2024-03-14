import { Input } from "@/components/ui/input";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "../ui/button";

const EmailSignUp = () => {
  // State for the email value
  const [email, setEmail] = useState("");

  return (
    <InputContainer className="relative flex w-full mx-auto overflow-hidden bg-white rounded-full items-center pr-8">
      <StyledInput
        type="email"
        placeholder="Email address"
        className="flex-1 w-full h-full text-[18px] p-8 text-sm text-gray-700 placeholder-gray-500 bg-white border-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit">Sign Up</Button>
      {/* <button
        type="submit"
        className="px-8 text-[18px] w-[150px] m-[8px] py-3 text-sm font-semibold text-white transition-colors duration-200 transform bg-teal-400 border-transparent rounded-full focus:border-transparent focus:ring-0 hover:bg-teal-500 focus:bg-teal-600 focus:outline-none"
      >
        Sign Up
      </button> */}
    </InputContainer>
  );
};

export default EmailSignUp;

const InputContainer = styled.div`
  max-width: 660px;
  height: 72px;
  width: 100%;
  font-size: 18px;

  input {
    outline: none !important;
    &:focus,
    &:active {
      outline: none !important;
    }
  }

  textarea:focus,
  input:focus {
    outline: none !important;
  }
`;

const StyledInput = styled(Input)`
  font-size: 18px !important;
`;
