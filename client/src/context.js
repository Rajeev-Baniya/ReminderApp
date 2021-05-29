import React, { useState, useContext } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [loggedIn, IsLoggedIn] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [editUserProfile, setEditUserProfile] = useState({
    name: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [postReminder, setPostReminder] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [homeData, setHomeData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [showErrors, setShowErrors] = useState([]);
  const [modalOpen, isModalOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [userProfile, setUserProfile] = useState([]);

  return (
    <AppContext.Provider
      value={{
        loggedIn,
        IsLoggedIn,
        registerData,
        setRegisterData,
        showErrors,
        setShowErrors,
        loginData,
        setLoginData,
        responseData,
        setResponseData,
        homeData,
        setHomeData,
        allData,
        setAllData,
        postReminder,
        setPostReminder,
        modalOpen,
        isModalOpen,
        deleted,
        setDeleted,
        userProfile,
        setUserProfile,
        editUserProfile,
        setEditUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
