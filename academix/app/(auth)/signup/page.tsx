"use client";

import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Brightness4Outlined } from '@mui/icons-material';



// Define light and dark themes
const lightTheme = {
  background: '#f9f1eb',
  formBackground: '#fff',
  textColor: '#000',
  inputBackground: '#fff',
  inputBorderColor: '#000',
  iconColor: '#888',
  buttonBackground: '#b673f8',
  buttonHoverBackground: '#7d00ff',
};

const darkTheme = {
  background: '#1a1a1a',
  formBackground: '#333',
  textColor: '#fff',
  inputBackground: '#444',
  inputBorderColor: '#fff',
  iconColor: '#bbb',
  buttonBackground: '#7d00ff',
  buttonHoverBackground: '#b673f8',
};

// Styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;



const Logo = styled.h1`
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.textColor};
`;

const FormContainer = styled.div`
  background: ${({ theme }) => theme.formBackground};
  padding: 5rem;
  border-radius: 100px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 100%;
`;

const Title = styled.h1`
  font-size: 3.3rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.textColor};
`;

const Subtitle = styled.p`
  margin-bottom: 3rem;
  color: #5F646D;
  font-size: 1.25rem;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const Icon = styled.div`
  position: absolute;
  top: 70%;
  left: 400px;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.iconColor};
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.textColor};
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 2.5rem;
  border: 2px solid ${({ theme }) => theme.inputBorderColor};
  border-radius: 100px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textColor};
  font-size: 1rem;
`;

const PasswordToggle = styled.div`
  position: absolute;
  top: 70%;
  left: 400px;
  transform: translateY(-50%);
  cursor: pointer;
  color: ${({ theme }) => theme.iconColor};
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 1.15rem;
  margin-top: 0.5rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.textColor};
`;

const Checkbox = styled.input`
  margin-right: 1rem;
`;

const Link = styled.a`
  color: #7d00ff;
  cursor: pointer;
  font-size: 1.25rem;
  margin-right: -3rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  box-shadow: 5px 10px 9px rgba(0, 0, 0, 0.5);
  background: ${({ theme }) => theme.buttonBackground};
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.buttonHoverBackground};
  }
`;

const DarkModeButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: 2px solid ${({ theme }) => theme.textColor};
  border-radius: 5px;
  padding: 0.5rem;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.textColor};
    color: ${({ theme }) => theme.background};
  }
`;

// Component


interface FormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [theme, setTheme] = useState('light');

  const validateEmail = (value: string) => {
    if (!value) {
      return 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      return 'Email is invalid';
    } else {
      return '';
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'Password is required';
    } else if (value.length < 6) {
      return 'Password must be at least 6 characters';
    } else {
      return '';
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: validateEmail(value),
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: validatePassword(value),
    }));
  };
  

  const validate = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      // Handle form submission logic
    }
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Simulate a successful login for demonstration
    console.log('Login successful'); // Replace with actual handling logic

    // You can add actual logic here to handle login (e.g., redirect or show a message)
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <Container>
      <DarkModeButton onClick={toggleTheme}>
  <Brightness4Outlined style={{ marginRight: '0.5rem' }} />
  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
</DarkModeButton>
        <Logo>Academi<span style={{ color: '#7d00ff' }}>X</span></Logo>
        <FormContainer>
          <Title>Sign in</Title>
          <Subtitle>Enter your account details</Subtitle>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Icon><FaEnvelope /></Icon>
              <Input 
                type="email" 
                id="email" 
                placeholder="Email" 
                value={email}
                onChange={handleEmailChange}
              />
            </InputGroup>
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            <InputGroup>
              <Label htmlFor="password">Password</Label>
              <Input 
                type={passwordVisible ? "text" : "password"} 
                id="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={handlePasswordChange}
              />
              <PasswordToggle onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </InputGroup>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            <CheckboxContainer>
              <CheckboxLabel>
                <Checkbox type="checkbox"/> Remember me
              </CheckboxLabel>
              <Link>Recover password</Link>
            </CheckboxContainer>
            <Button type="submit">Sign in</Button>
          </form>
        </FormContainer>
      </Container>
    </ThemeProvider>
  );
};

export default Login;

