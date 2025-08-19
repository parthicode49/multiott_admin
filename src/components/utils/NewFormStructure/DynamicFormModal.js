import { useState, useRef, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Autocomplete,
  InputLabel,
  InputAdornment,
  Paper,
  useTheme,
  Typography,
  Box,
  IconButton,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  Chip,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { Slide } from "@mui/material";
import { IMAGE } from "../../../api";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { DatePicker, TimeField } from "@mui/x-date-pickers";

const DynamicFormModal = ({
  open,
  onClose,
  formStructure,
  onSubmit,
  formData,
  setFormData,
  initialData,
  title,
  // darkMode = false,
}) => {
  const theme = useTheme();
  const darkMode = JSON.parse(sessionStorage.getItem("darkMode"));
  // const [formData, setFormData] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [allowSubmit, setAllowSubmit] = useState(true);
  const fileInputRefs = useRef({});
  if (!formData) {
    console.warn("formData is undefined!");
    return null; // or a loading spinner, or skip rendering the form
  }
  // console.log(onClose, "fdsfdffdsfsdfsdf");
  const handleClose = () => {
    onClose(); // Call parent's onClose
    setTimeout(() => {
      setAllowSubmit(true); // Reset submit state
      setFilePreviews({});
    }, 100);
  };
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // useMemo(()=>{

  // },[])
  // useMemo(()=>{
  //   if(initialData != {} ){
  //     setFormData(initialData)
  //   }
  // },[initialData])

  const handleFileChange = (fieldName, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Store the file object
    handleChange(fieldName, file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviews((prev) => ({
          ...prev,
          [fieldName]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreviews((prev) => ({
        ...prev,
        [fieldName]: file.name,
      }));
    }
  };

  const removeFile = (fieldName) => {
    handleChange(fieldName, null);
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
    if (fileInputRefs.current[fieldName]) {
      fileInputRefs.current[fieldName].value = "";
    }
  };

  // const handleSubmit = () => {

  //   onSubmit(formData);
  //   onClose();
  //   setFormData({});
  //   setFilePreviews({});
  // };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default submission

    let requiredFieldCount = 0; // Total required fields count
    let requiredFieldFilledCount = 0; // Filled required fields count
    let emailValid = true; // Email validity flag
    let mobileValid = true; // Mobile number validity flag
    let pancardValid = true; // PAN validity flag
    let gstValid = true; // GST validity flag

    formStructure?.forEach((field) => {
      console.log(field.required, formStructure, "Hiii Parth Check THis");
      if (field.required && field.display !== "none") {
        requiredFieldCount++; // Count all required fields
        const fieldValue = String(formData[field.name] || "").trim(); // Ensure the field value is a string
        // console.log(fieldValue, "dsfdfsdd");
        // General required field check
        if (fieldValue) {
          // Email validation
          if (field?.isEmail) {
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(fieldValue)) {
              emailValid = false; // Email is invalid
            } else {
              requiredFieldFilledCount++; // Increment count for valid email
            }
          }

          // Mobile validation
          if (field?.isMobile) {
            const digits = fieldValue.replace(/\D/g, "").slice(2); // Extract digits after +91
            if (digits.length === 10) {
              requiredFieldFilledCount++; // Increment count for valid mobile number
            } else {
              mobileValid = false; // Mobile number is invalid
            }
          }

          // PAN validation
          if (field?.isPancard) {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!panRegex.test(fieldValue)) {
              pancardValid = false; // PAN is invalid
            } else {
              requiredFieldFilledCount++; // Increment count for valid PAN
            }
          }

          // GST validation
          if (field?.isGst) {
            const gstRegex =
              /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
            if (!gstRegex.test(fieldValue)) {
              gstValid = false; // PAN is invalid
            } else {
              requiredFieldFilledCount++; // Increment count for valid PAN
            }
          }

          // For other fields
          if (
            !field.isEmail &&
            !field.isMobile &&
            !field?.isGst &&
            !field?.isPancard
          ) {
            requiredFieldFilledCount++; // Increment count if field is filled
          }
        }
      }
    });

    // Validate the form
    const isFormValid =
      requiredFieldCount === requiredFieldFilledCount &&
      emailValid &&
      mobileValid &&
      pancardValid &&
      gstValid;
    // console.log(isFormValid, "grretertert");
    console.log(
      "chchhchchchcch",
      isFormValid,
      requiredFieldCount,
      requiredFieldFilledCount
    );

    if (isFormValid) {
      // console.log("chchhchchchcch12");
      setAllowSubmit(true); // Allow submission
      onSubmit(formData); // Call submit handler
      setTimeout(() => {
        // setAllowSubmit(true) ; // Reset submit state
        setFilePreviews({});
      }, 100);
    } else {
      setAllowSubmit(false); // Block submission
      console.error({
        requiredFieldCount,
        requiredFieldFilledCount,
        emailValid,
        mobileValid,
        pancardValid,
        formData,
      }); // Log detailed debug info
    }
  };

  // Theme-based styles
  const dialogStyles = {
    "& .MuiDialog-container": {
      alignItems: "flex-start",
    },
    "& .MuiPaper-root": {
      marginTop: "5vh",
      width: "25%",
      maxWidth: "800px",
      maxHeight: "80vh",
      overflow: "auto",
      backgroundColor: darkMode
        ? theme.palette.grey[900]
        : theme.palette.background.paper,
      color: darkMode ? theme.palette.text.primary : theme.palette.text.primary,
      border: darkMode
        ? "1px solid rgba(255, 255, 255, 0.12)"
        : "1px solid rgba(0, 0, 0, 0.12)",
    },
  };

  const textFieldStyles = {
    borderRadius: 2,
    backgroundColor: "var(--themeColorLighterShade)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--themeColorLighterShade)  !important",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: darkMode
        ? "0 0 0 100px rgb(22, 22, 22) inset"
        : "0 0 0 100px rgb(255, 255, 255) inset", // Red background for autofill
      WebkitTextFillColor: "var(--themeFontColor)", // Text color for autofilled content
    },
  };

  const inputLabelStyles = {
    color: darkMode ? theme.palette.text.secondary : theme.palette.text.primary,
  };

  const fileUploadStyles = {
    border: `2px dashed ${
      darkMode ? theme.palette.grey[700] : theme.palette.grey[400]
    }`,
    borderRadius: 2,
    padding: 3,
    textAlign: "center",
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    cursor: "pointer",
    // backgroundColor: darkMode ? theme.palette.grey[800] : theme.palette.grey[100],
    // '&:hover': {
    //   borderColor: theme.palette.primary.main,
    //   backgroundColor: darkMode ? theme.palette.grey[700] : theme.palette.grey[200]
    // }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: "down" }}
      sx={dialogStyles}
    >
      <DialogTitle
        sx={{
          backgroundColor: "var(--themeColor)",
          borderBottom: darkMode
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "var(--themeColor)",
        }}
      >
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {formStructure?.map((field, index) => {
            switch (field.type) {
              case "inputBox":
                return (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    key={index}
                    display={field.display || "block"}
                  >
                    <InputLabel shrink sx={inputLabelStyles}>
                      {field.title}
                      {field.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </InputLabel>
                    <TextField
                      fullWidth
                      value={formData[field?.name] || ""}
                      size="small"
                      onChange={(e) => {
                        if (field.regex) {
                          if (
                            e.target.value === "" ||
                            field.regex.test(e.target.value)
                          ) {
                            handleChange(field.name, e.target.value);
                          }
                        } else {
                          handleChange(field.name, e.target.value);
                        }
                      }}
                      placeholder={field.placeholder}
                      required={field.required}
                      multiline={field.multiline}
                      rows={field.row}
                      // inputProps={{
                      //   maxLength: field.maxLength || undefined,
                      // }}
                      // sx={textFieldStyles}
                      error={
                        (field.required && !formData[field.name]) ||
                        (field.regex &&
                          formData[field.name] &&
                          !field.regex.test(formData[field.name]))
                      }
                      helperText={
                        (!allowSubmit &&
                          field.required &&
                          !formData[field.name] && (
                            <span style={{ color: "red" }}>
                              Please fill this field
                            </span>
                          )) ||
                        (field.regex &&
                          formData[field.name] &&
                          !field.regex.test(formData[field.name]) && (
                            <span style={{ color: "red" }}>
                              {field.errorMessage || "Invalid input format"}
                            </span>
                          )) ||
                        (field.maxLength && (
                          <span
                            style={{
                              color:
                                formData[field.name]?.length >= field.maxLength
                                  ? "red"
                                  : "inherit",
                              float: "right",
                            }}
                          >
                            {formData[field.name]?.length || 0}/
                            {field.maxLength}
                          </span>
                        ))
                      }
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          backgroundColor: "var(--themeColorLighterShade)",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              "var(--themeColorLighterShade)  !important",
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow: darkMode
                              ? "0 0 0 100px rgb(22, 22, 22) inset"
                              : "0 0 0 100px rgb(255, 255, 255) inset", // Red background for autofill
                            WebkitTextFillColor: "var(--themeFontColor)", // Text color for autofilled content
                          },
                        },
                        inputProps: {
                          min: field?.min,
                          max: field?.max,
                          step: field?.step || 1,
                          maxLength: field?.maxLength,
                          style: {
                            color: "var(--themeFontColor)", // Placeholder color to light grey
                            // paddingLeft: "10px", // Left padding for the placeholder
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: inputLabelStyles,
                        inputProps: {
                          min: field?.min,
                          max: field?.max,
                          step: field?.step || 1,
                          maxLength: field?.maxLength,
                          style: {
                            color: "var(--themeFontColor)", // Placeholder color to light grey
                            paddingLeft: "10px", // Left padding for the placeholder
                          },
                        },
                      }}
                    />
                  </Grid>
                );
              case "date":
                return (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={field?.size || 12}
                    key={index + "-grid"}
                    display={field.display || "block"}
                  >
                    <InputLabel
                      shrink={true}
                      style={{
                        marginBottom: "12px",
                        color: darkMode ? "#ffffff" : "#151515",
                      }}
                    >
                      <span>{field.title}</span>
                      {field?.required && (
                        <span style={{ color: "red", paddingLeft: "5px" }}>
                          *
                        </span>
                      )}
                    </InputLabel>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        // label={value.placeholder || value.title}
                        value={
                          formData?.[field.name]
                            ? dayjs(formData?.[field.name])
                            : null
                        }
                        minDate={field.min ? dayjs(field.min) : undefined}
                        maxDate={field.max ? dayjs(field.max) : undefined}
                        defaultValue={
                          formData?.[field.name]
                            ? undefined
                            : field.default
                            ? dayjs(field.default)
                            : undefined
                        }
                        onChange={(newValue) => {
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: newValue
                              ? dayjs(newValue).format("YYYY-MM-DD")
                              : "",
                          }));
                        }}
                        slots={{
                          openPickerIcon: CalendarTodayIcon,
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: field?.required,
                            placeholder: field.placeholder,
                            InputProps: {
                              startAdornment: field?.symbol && (
                                <InputAdornment position="start">
                                  {field.symbol}
                                </InputAdornment>
                              ),
                              sx: {
                                borderRadius: 2,
                                backgroundColor:
                                  "var(--themeColorLighterShade)",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    "var(--themeColorLighterShade) !important",
                                },
                                "& input:-webkit-autofill": {
                                  WebkitBoxShadow: darkMode
                                    ? "0 0 0 100px rgb(22, 22, 22) inset"
                                    : "0 0 0 100px rgb(255, 255, 255) inset",
                                  WebkitTextFillColor: "var(--themeFontColor)",
                                },
                              },
                            },
                          },
                          openPickerIcon: {
                            sx: { color: "#DE4444" },
                          },
                        }}
                      />
                    </LocalizationProvider>
                    {!allowSubmit &&
                      field.required &&
                      !formData[field.name] && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "red !important",
                            display: "block",
                            mb: 1,
                          }}
                        >
                          Please fill this field
                        </Typography>
                      )}
                  </Grid>
                );
              case "select":
                return (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    key={index}
                    display={field.display || "block"}
                  >
                    <InputLabel shrink sx={inputLabelStyles}>
                      {field.title}
                      {field.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </InputLabel>
                    <Autocomplete
                      options={field.options || []}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.value === selectedValue?.value
                      } // Compare by value
                      value={
                        field?.options?.find(
                          (opt) => opt?.value === formData?.[field.name]
                        ) || null
                      }
                      disabled={field?.disabled ? true : false}
                      onChange={(e, newValue) =>
                        handleChange(field.name, newValue?.value || "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={field.placeholder}
                          required={field.required}
                          size="small"
                          sx={textFieldStyles}
                          helperText={
                            !allowSubmit &&
                            (formData?.[field.name] == undefined ||
                              formData?.[field.name]?.length <= 0) &&
                            field?.required && (
                              <p
                                style={{
                                  // textAlign: "right",
                                  marginTop: "-3px",
                                  color: "#DE4444",
                                }}
                              >
                                Please fill this field
                              </p>
                            )
                          }
                          InputLabelProps={{
                            sx: inputLabelStyles,
                          }}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              borderRadius: 2,
                              backgroundColor: "var(--themeColorLighterShade)",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  "var(--themeColorLighterShade)  !important",
                              },
                            },
                          }}
                          inputProps={{
                            ...params.inputProps,
                            style: {
                              paddingLeft: "10px", // Placeholder padding
                              color: darkMode ? "#ffffff" : "#151515",
                              // color: form?.[value.name]
                              //   ? "#151515"
                              //   : "rgba(21, 21, 21, 1)", // Light grey placeholder color
                            },
                          }}
                          style={{
                            "& .MuiInputBase-root": {
                              color: darkMode ? "#ffffff" : "#151515",
                            },
                          }}
                        />
                      )}
                      PaperComponent={({ children }) => (
                        <div
                          style={{
                            backgroundColor: darkMode
                              ? "rgba(100, 206, 70, 0.2)"
                              : "rgba(100, 206, 70, 0.1)",
                            color: darkMode ? "#ffffff" : "#151515",
                            "&:hover": {
                              backgroundColor: darkMode ? "#333333" : "#f0f0f7",
                            },
                          }}
                        >
                          <Paper
                            sx={{
                              backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                              color: darkMode ? "#ffffff" : "#151515",
                              "& .MuiAutocomplete-option": {
                                "&:hover": {
                                  backgroundColor: darkMode
                                    ? "#333333"
                                    : "#f5f5fa",
                                },
                                '&[aria-selected="true"]': {
                                  backgroundColor: darkMode
                                    ? "rgba(100, 206, 70, 0.2)"
                                    : "rgba(100, 206, 70, 0.1)",
                                },
                                '&[aria-selected="true"].Mui-focused': {
                                  backgroundColor: darkMode
                                    ? "rgba(100, 206, 70, 0.3)"
                                    : "rgba(100, 206, 70, 0.2)",
                                },
                              },
                            }}
                          >
                            {children}
                          </Paper>
                        </div>
                      )}
                    />
                  </Grid>
                );
              case "multiselect":
                return (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    key={index + "-grid"}
                    lg={12}
                    display={field.display || "block"}
                  >
                    <InputLabel
                      shrink={true}
                      style={{
                        marginBottom: "12px",
                        color: darkMode ? "#ffffff" : "#151515",
                      }}
                    >
                      <span>{field.title}</span>
                      {field?.required && (
                        <span style={{ color: "red", paddingLeft: "5px" }}>
                          *
                        </span>
                      )}
                    </InputLabel>
                    <Autocomplete
                      multiple
                      id={`multi-select-${field.name}`}
                      options={field.options || []}
                      getOptionLabel={(option) => option.label}
                       isOptionEqualToValue={(option, selectedValue) =>
                        option.value === selectedValue?.value
                      } // Compare by value
                      filterSelectedOptions
                      value={
                        field.options.filter((opt) =>
                          formData?.[field.name]?.includes(opt.value)
                        ) || []
                      }
                      disabled={field?.disabled}
                      onChange={(event, newValue) => {
                        setFormData({
                          ...formData,
                          [field.name]: newValue.map((item) => item.value),
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required={field?.required}
                          placeholder={field?.placeholder}
                          helperText={
                            (!allowSubmit &&
                              (formData?.[field.name] == undefined ||
                                formData?.[field.name]?.length <= 0) &&
                              field?.required && (
                                <p
                                  style={{
                                    textAlign: "left",
                                    color: "red",
                                  }}
                                >
                                  Please fill this field
                                </p>
                              )) ||
                            (formData?.[field.name]?.length ===
                              (field?.maxSelections || 10) &&
                              (field?.errorText || (
                                <p
                                  style={{
                                    textAlign: "left",
                                    color: "red",
                                  }}
                                >
                                  Maximum number of selections have been made.
                                </p>
                              )))
                          }
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              borderRadius: 2,
                              backgroundColor: "var(--themeColorLighterShade)",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  "var(--themeColorLighterShade)  !important",
                              },
                              // backgroundColor: darkMode
                              //   ? "#0d0d0d"
                              //   : "#e6e6ef",
                              // "& .MuiOutlinedInput-notchedOutline": {
                              //   borderColor: darkMode
                              //     ? "#333333"
                              //     : "#d1d1e0 !important",
                              // },
                              // "&:hover .MuiOutlinedInput-notchedOutline":
                              //   {
                              //     borderColor: darkMode
                              //       ? "#555555"
                              //       : "#a1a1b5 !important",
                              //   },
                            },
                          }}
                          inputProps={{
                            ...params.inputProps,
                            style: {
                              paddingLeft: "10px",
                              color: darkMode ? "#ffffff" : "#151515",
                            },
                          }}
                          sx={{
                            "& .MuiInputBase-root": {
                              color: darkMode ? "#ffffff" : "#151515",
                            },
                          }}
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li
                          {...props}
                          style={{
                            ...props.style,
                            backgroundColor: selected
                              ? darkMode
                                ? "rgba(100, 206, 70, 0.2)"
                                : "rgba(100, 206, 70, 0.1)"
                              : null,
                            color: darkMode ? "#ffffff" : "#151515",
                            "&:hover": {
                              backgroundColor: darkMode ? "#333333" : "#f0f0f7",
                            },
                          }}
                        >
                          {option.label}
                        </li>
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.value}
                            label={option.label}
                            style={{
                              backgroundColor: darkMode
                                ? "rgba(100, 206, 70, 0.3)"
                                : "rgba(100, 206, 70, 0.2)",
                              color: darkMode ? "#ffffff" : "#1B3720",
                              border: darkMode
                                ? "1px solid rgba(100, 206, 70, 0.5)"
                                : "1px solid #64CE46",
                              margin: "4px",
                            }}
                            // deleteIcon={
                            //   <CancelIcon
                            //     style={{
                            //       color: darkMode
                            //         ? "#ffffff"
                            //         : "#1B3720",
                            //       fontSize: "16px",
                            //     }}
                            //   />
                            // }
                          />
                        ))
                      }
                      PaperComponent={({ children }) => (
                        <Paper
                          sx={{
                            backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                            color: darkMode ? "#ffffff" : "#151515",
                            "& .MuiAutocomplete-option": {
                              "&:hover": {
                                backgroundColor: darkMode
                                  ? "#333333"
                                  : "#f5f5fa",
                              },
                              '&[aria-selected="true"]': {
                                backgroundColor: darkMode
                                  ? "rgba(100, 206, 70, 0.2)"
                                  : "rgba(100, 206, 70, 0.1)",
                              },
                              '&[aria-selected="true"].Mui-focused': {
                                backgroundColor: darkMode
                                  ? "rgba(100, 206, 70, 0.3)"
                                  : "rgba(100, 206, 70, 0.2)",
                              },
                            },
                          }}
                        >
                          {children}
                        </Paper>
                      )}
                    />
                  </Grid>
                );

              case "file":
                return (
                  <Grid item xs={12} md={12} key={index}>
                    <InputLabel shrink sx={inputLabelStyles}>
                      {field.title}
                      {field.required && (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </InputLabel>

                    <input
                      type="file"
                      id={`file-upload-${field.name}`}
                      ref={(el) => (fileInputRefs.current[field.name] = el)}
                      onChange={(e) => handleFileChange(field.name, e)}
                      accept={field.accept || "*"}
                      style={{ display: "none" }}
                    />

                    {!filePreviews[field.name] && !formData[field.name] ? (
                      <Box
                        component="label"
                        htmlFor={`file-upload-${field.name}`}
                        sx={fileUploadStyles}
                      >
                        <CloudUpload
                          fontSize="large"
                          sx={{
                            color: darkMode
                              ? theme.palette.text.secondary
                              : theme.palette.text.primary,
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: darkMode
                              ? theme.palette.text.secondary
                              : theme.palette.text.primary,
                          }}
                        >
                          Click to upload or drag and drop
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode
                              ? theme.palette.text.secondary
                              : theme.palette.text.primary,
                          }}
                        >
                          {field.description ||
                            "Supported formats: " + (field.accept || "Any")}
                          {field.maxSize && ` | Max size: ${field.maxSize}MB`}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          border: `1px solid ${
                            darkMode
                              ? theme.palette.grey[700]
                              : theme.palette.grey[300]
                          }`,
                          borderRadius: 1,
                          p: 2,
                          position: "relative",
                        }}
                      >
                        {/* Handle both local previews and API URLs */}
                        {typeof filePreviews[field.name] === "string" ? (
                          filePreviews[field.name].startsWith("data:image") ? (
                            <img
                              src={filePreviews[field.name]}
                              alt="Preview"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "150px",
                                display: "block",
                                margin: "0 auto",
                              }}
                            />
                          ) : (
                            <Typography
                              sx={{
                                color: darkMode
                                  ? theme.palette.text.primary
                                  : theme.palette.text.primary,
                              }}
                            >
                              {filePreviews[field.name]}
                            </Typography>
                          )
                        ) : typeof formData[field.name] === "string" ? (
                          <img
                            src={`${IMAGE}${formData[field.name]}`}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "150px",
                              display: "block",
                              margin: "0 auto",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "path_to_fallback_image.jpg";
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              color: darkMode
                                ? theme.palette.text.primary
                                : theme.palette.text.primary,
                            }}
                          >
                            {formData[field.name]?.name || "File selected"}
                          </Typography>
                        )}

                        <IconButton
                          size="small"
                          onClick={() => removeFile(field.name)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            color: darkMode
                              ? theme.palette.error.light
                              : theme.palette.error.main,
                            backgroundColor: darkMode
                              ? theme.palette.grey[800]
                              : theme.palette.grey[200],
                            "&:hover": {
                              backgroundColor: darkMode
                                ? theme.palette.grey[700]
                                : theme.palette.grey[300],
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>

                        <Button
                          size="small"
                          variant="outlined"
                          component="label"
                          htmlFor={`file-upload-${field.name}`}
                          sx={{
                            mt: 1,
                            color: darkMode
                              ? theme.palette.text.secondary
                              : theme.palette.text.primary,
                            borderColor: darkMode
                              ? theme.palette.grey[600]
                              : theme.palette.grey[400],
                          }}
                        >
                          Change File
                        </Button>
                      </Box>
                    )}

                    {!allowSubmit &&
                      field.required &&
                      !formData[field.name] && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "red !important",
                            display: "block",
                            mb: 1,
                          }}
                        >
                          Please upload a file
                        </Typography>
                      )}
                  </Grid>
                );
              case "toggle":
                return (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    key={index + "-grid"}
                    lg={field?.size || 6}
                    container
                    direction="row"
                    alignItems={"center"}
                    display={field.display || "block"}
                    style={{ marginTop: "1rem" }}
                  >
                    <FormControl>
                      <Box sx={{ marginTop: "20px" }}>
                        <InputLabel
                          shrink={true}
                          style={{
                            fontWeight: "bold",
                            color: "#151515",
                            marginLeft: "-10px",
                          }}
                        >
                          {/* Label with Mandatory */}
                          <span>{field.title}</span>
                        </InputLabel>
                      </Box>

                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        {field?.options?.map((option, index) => (
                          <FormControlLabel
                            key={field.name + index}
                            value={option.value}
                            name={field.name}
                            required={field?.required}
                            disabled={field.disabled ? true : false}
                            onChange={(event) => {
                              setFormData({
                                ...formData,
                                [event.target.name]: event.target.value,
                              });
                            }}
                            control={
                              <Radio
                                color={option.color}
                                // required

                                checked={
                                  formData?.[field.name] != undefined
                                    ? formData?.[field.name] == option.value
                                    : option.value == field?.default
                                }
                              />
                            }
                            label={option.value}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <div>
                      {!allowSubmit &&
                        field.required &&
                        !formData?.[field.name] && (
                          <p
                            style={{
                              // textAlign: "right",
                              marginTop: "-1px",
                              fontSize: "0.75rem",
                              color: "#DE4444",
                            }}
                          >
                            Please fill this field
                          </p>
                        )}
                    </div>
                  </Grid>
                );
              default:
                return null;
            }
          })}
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "var(--themeColor)",
          borderTop: darkMode
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            color: "var(--gradientColor2)",
            border: "1px solid var(--gradientColor2)",
            "&:hover": {
              backgroundColor: "var(--gradientColor2)",
              color: "#fff",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={(e) => handleFormSubmit(e)}
          variant="contained"
          sx={{
            background: "var(--gradientColor2)",
            color: "#fff",
            padding: "0.5rem 1rem",
            // fontSize: "10px",
            // fontWeight: "400",
            "&:hover": {
              backgroundColor: "var(--gradientColor2)",
              opacity: "70%",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicFormModal;
