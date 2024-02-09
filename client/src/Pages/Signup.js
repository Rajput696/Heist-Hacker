/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import "../css/Auth.css"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OtpInput from "react-otp-input";
import LoadingBar from 'react-top-loading-bar';
import InterviewerDetails from '../Interviewer/InterviewerDetails';


export default function Signup() {
  const [progress, setProgress] = useState(0)

  const appName = 'Wisper Talks';
  const companyName = 'wisperTalks'

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
    validOTP: '',
    avatar: ''
  });

  const handleInputChange = async (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const showMessages = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000
    });
  }

  const [validEmail, setValidEmail] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validOTP, setValidOTP] = useState(false);


  const vaildEmailChecker = async (feild, value) => {
    try {
      const response = await fetch('/interviewer/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [feild]: value }),
      });

      if (!response.ok) {
        throw new Error(`Failed to check ${feild} validity: ${response.status}`);
      }

      const result = await response.json();
      if (feild === 'email') {
        setValidEmail(result);
      } else if (feild === 'name') {
        setValidName(result);
      }
    } catch (error) {
      console.error('Error checking email validity:', error);
      setValidEmail(false);
      setValidName(false);
    }
  };


  const [showOtpFeild, setShowOtpFeild] = useState(false);
  const [Registered, setRegistered] = useState(false);


  const sendOtpFunction = async (e) => {
    e.preventDefault();
    setProgress(70);
    formData.validOTP = await (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString();
    try {
      const response = await fetch('/interviewer/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'chat.application@gmail.com',
          to: formData.email,
          subject: `Account Verification for Your ${appName}`,
          html: `<p style="color: var(--primary-text-light); font-size: 16px; font-family: "Poppins", "sans-sarif";
          ">Dear ${formData.name},</p>
                        
              <p style="color: var(--primary-text-light); font-size: 16px;">We hope this email finds you well. Thank you for choosing ${appName} as your preferred communication platform. To enhance the security of your account and ensure a safe and secure user experience, we require your assistance in completing the account verification process.</p>
          
              <p style="color: var(--primary-text-light); font-size: 16px; text-align: center;"><strong>Click the following link to access the verification page:</strong></p>
              
              
              <p style="color: var(--primary-blue4); text-align: center;  font-size: 16px;"><a href="https://portfolio-madhav.vercel.app/" style="color: var(--primary-blue4); text-decoration: none; text-align: center;">Verify My Account</a></p>
          
              <p style="color: var(--primary-text-light); text-align: center; font-size: 16px;"><strong>Enter the One-Time Password (OTP) provided below when prompted:</strong></p>
              <p style="color: var(--primary-text-light); font-size: 29px; text-align: center;"><strong style="color: var(--primary-blue4);">${formData.validOTP}</strong></p>
          
              <p style="color: var(--primary-text-light); font-size: 16px;">Please note that the OTP is valid for a limited time, so we recommend completing the verification process as soon as possible.</p>
          
              <p style="color: var(--primary-text-light); font-size: 16px;">If you did not initiate this request or if you have any concerns, please contact our support team immediately at <a href="mailto:manumadhavjangid@gmail.com" style="color: var(--primary-blue4); text-decoration: none;">E-Mail</a>.</p>
          
              <p style="color: var(--primary-text-light); font-size: 16px;">Thank you for your cooperation in ensuring the security of your account. We appreciate your trust in ${appName}.</p>
          
              <p style="color: var(--primary-text-light); font-size: 16px;">Best regards,<br>
              ${companyName}<br>
              ${appName} Support Team</p>`,
        })
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`);
      }

      const dataFromEmail = await response.json();
      showMessages(dataFromEmail.type, dataFromEmail.message);
      if (dataFromEmail.type === 'success') {
        setValidOTP(true);
        setShowOtpFeild(true);
        setProgress(100);
      } else {
        showMessages('error', 'Something went wrong plese try again')
      }
    } catch (error) {
      console.error('Error during OTP verification:', error.message);
    }
  };

  const [navigate, setNavigate] = useState(false)


  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.validOTP === formData.otp) {
      try {
        const response = await fetch('/interviwer/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email, password: formData.password, name: formData.name }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          showMessages('error', `Registration failed: ${error.message}`)
          throw new Error(`Registration failed: ${error}`);
        }

        const responseData = await response.json();
        console.log('User registered successfully:', responseData._id);
        if (responseData) {
          setRegistered(true)
        }
        showMessages('success', `${responseData.name} you have registered successfully`);
        setNavigate(true);
        localStorage.setItem('user', JSON.stringify(responseData))
      } catch (error) {
        console.error('Error during registration:', error);
        showMessages('error', error.message)
      }
    } else {
      showMessages('error', `${formData.otp} you enterd is wrong. Enter correct OTP to proceed.`)
    }
  };

  const handleError = (e) => {
    e.preventDefault();
    showMessages('error', 'All feilds must be correct')
  }

  const [navigateUserToChats, setNavigateUserToChats] = useState(false)



  useEffect(() => {
    if (localStorage.getItem('user')) {
      setNavigateUserToChats(true)
    }
  }, [])


  return (
    <div className='authPage'>
      {Registered ? 
      <Navigate to={<InterviewerDetails />}></Navigate>  : null 
    }
      {/* {navigateUserToChats ?
        (
          localStorage.getItem('user') ?
            <Navigate to={'/home/chats'}></Navigate> : null
        ) :
        null
      } */}
      <LoadingBar
        height={5}
        color='var(--primary-text- bark)'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {/* {
        navigate ?
          <Navigate to={'/home/chats'}></Navigate> :
          null
      } */}
      <ToastContainer></ToastContainer>
      <div className="authFormCont register">
        <div className="pageInfo">
          <h2>Create an account as Interviewer</h2>
          <p>Join our community and start your journy of taking Interviewes and earn</p>
        </div>
        <form
          onSubmit={validEmail && validName ? handleRegister : handleError}
          className="authForm registerForm">
          <h2>Create Account..</h2>
          <div className='feilds'>
            <TextField
              className='inputFeild'
              id="outlined-basic1"
              label="Username"
              name='name'
              variant="standard"
              onChange={(e) => {
                console.log(e.target.value);
                handleInputChange(e);
                vaildEmailChecker('name', e.target.value);
              }} />
            {formData.name.length > 0 ? (
              <p>
                {validName ? <CheckCircleIcon className='icon' /> : <ErrorIcon className='icon error' />}
              </p>
            ) : ''}
          </div>

          <div className='feilds'>
            <TextField
              className='inputFeild'
              id="outlined-basic2"
              label="E-mail"
              name='email'
              variant="standard"
              onChange={(e) => {
                handleInputChange(e);
                vaildEmailChecker('email', e.target.value);
              }} />
            {formData.email.length > 0 ? (
              <p>
                {validEmail ? <CheckCircleIcon className='icon' /> : <ErrorIcon className='icon error' />}
              </p>
            ) : ''}
          </div>
          <FormControl className='feilds' variant="standard" sx={{ m: 1 }}>
            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
              name='password'
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange(e)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>


          <div className='feilds' style={showOtpFeild ? { display: 'flex' } : { display: 'none' }}>
            <OtpInput
              containerStyle="otp-container"
              inputStyle="otp-input"
              value={formData.otp}
              onChange={(otp) => handleInputChange({ target: { name: 'otp', value: otp } })}
              numInputs={5}
              separator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
            />
          </div>

          {
            validOTP ?
              <Button type='submit' className='authButtons' variant="contained" id='RegisterButton' >Register</Button> :
              <Button
                variant="contained"
                onClick={(e) => {
                  validEmail && validName ? sendOtpFunction(e) : showMessages('error', 'All feilds are inportant');

                }}
                className='authButtons'
                id='otpVerifyButton'
              >Send OTP</Button>
          }
          <h5><span></span> Or Login <span></span></h5>
          <h4>
            Already have an account
            <Link className='link' to={'/'}> Login</Link>
          </h4>
        </form>
      </div>
    </div>
  )
}