import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "./_app";
import UserSidebar from "/components/UserSidebar";
import { useFormik } from "formik";
import * as yup from "yup";
import { getUserCookie } from "/lib/cookies";
import { useLoaderData } from "react-router-dom";
import { getUser, updateUser } from "@/lib/userData";
import { isBlockedAtom, userAtom } from "@/store";
import { Commet } from 'react-loading-indicators';
import { useAtom } from "jotai";

export default function Profile() {
  const { theme } = useContext(ThemeContext);
  const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);  
  const [user, setUser] = useAtom(userAtom);

  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState("");

  const formik = useFormik({
    validationSchema: yup.object().shape({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      phone: yup.string(),
      emergencyContact: yup.string().required("Emergency contact is required"),
      language: yup.string(),
      currency: yup.string(),
      password: yup.string().min(8, "Password must be at least 8 characters"),
    }),
    onSubmit: async values => { console.log(values); },
    // onSubmit: async (values) => {
    //   setIsBlocked(true);
    //   // try {
    //     const body = {
    //       email: values.email,
    //       firstName: values.firstName,
    //       lastName: values.lastName,
    //       phone: values.phone,
    //       preferences: {
    //         currency: values.currency,
    //         language: values.language,
    //       },
    //     };

    //     const updateData = await updateUser(body);
    //     if (updateData) {
    //       setWarning("");
    //       setSuccess("User updated successfully");
    //     } else {
    //       setSuccess("");
    //       setWarning("Failed to update user");
    //     }

    //   setIsBlocked(false);

    //   //   const res = await fetch("/userManagement/update-user", {
    //   //     method: "POST",
    //   //     headers: {
    //   //       "Content-Type": "application/json",
    //   //     },
    //   //     body: JSON.stringify(body),
    //   //   });
    //   //   const data = await res.json();
    //   //   if (data.success) {
    //   //     setWarning("");
    //   //     setSuccess("User updated successfully");
    //   //   } else {
    //   //     setSuccess("");
    //   //     setWarning(data.message || "Failed to update user");
    //   //   }
    //   // } catch (err) {
    //   //   setSuccess("");
    //   //   setWarning("Failed to update profile");
    //   // }
    // },
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      emergencyContact: "",
      language: "",
      currency: "",
      password: "",
    },
  });

  async function updateUser(values) {
      console.log(values);

      setIsBlocked(true);
      const body = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        preferences: {
          currency: values.currency,
          language: values.language,
        },
      };

      const updateData = await updateUser(body);
      if (updateData) {
        setWarning("");
        setSuccess("User updated successfully");
      } else {
        setSuccess("");
        setWarning("Failed to update user");
      }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const email = getUserCookie()?.email;
      if (!email) {
        setWarning("No user email found in cookie");
        return;
      }

      loadData()
      // try {
      //   const res = await fetch(`/userManagement/get-by-email?email=${encodeURIComponent(email)}`);
      //   const data = await res.json();
      //   if (data.success) {
      //     const user = data.user;
      //     formik.setValues({
      //       firstName: user.firstName || "",
      //       lastName: user.lastName || "",
      //       email: user.email || "",
      //       phone: user.phone || "",
      //       emergencyContact: "",
      //       language: user.preferences?.language || "",
      //       currency: user.preferences?.currency || "",
      //       password: "",
      //     });
      //   } else {
      //     setWarning(data.message || "Failed to load user data");
      //   }
      // } catch (error) {
      //   setWarning("Error fetching user data");
      // }
    };
    fetchUserData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadData() {
    setIsLoading(true);
    const tmpUser = await getUser();
    setUser(tmpUser);

    if(tmpUser) {
      formik.setValues({
        firstName: tmpUser.firstName || "",
        lastName: tmpUser.lastName || "",
        email: tmpUser.email || "",
        phone: tmpUser.phone || "",
        emergencyContact: "",
        language: tmpUser.preferences?.language || "",
        currency: tmpUser.preferences?.currency || "",
        password: "",
      });
    }

    setIsLoading(false);
  }

  // Validation schema

  return (
    <Row className="m-0 p-4">
      {/* Sidebar */}
      { <Col md={3}>
        <UserSidebar user={user} />
      </Col> }

      {/* Profile Form */}
      <Col
        md={9}
        className={`${theme === "dark" ? "bg-black text-white" : "bg-light text-dark"} p-5`}
      >
        <h2 className="mb-4">Profile</h2>

        {
          isLoading ?
          (<div className="d-flex justify-content-center align-items-center py-3">
              <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
          </div>)
          :
          (
            <Form noValidate onSubmit={formik.handleSubmit}>
              {/* Alerts */}
              {warning && <Alert variant="danger">{warning}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {/* Personal Info */}
              <h5 className="mt-3">Personal Information</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your first name"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your last name"
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your phone number"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Emergency Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your emergency contact number"
                      name="emergencyContact"
                      value={formik.values.emergencyContact}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.emergencyContact}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.emergencyContact}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                </Col>
              </Row>

              {/* Preferences */}
              <h5 className="mt-3">Preferences</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Preferred Language</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your preferred language"
                      name="language"
                      value={formik.values.language}
                      onChange={formik.handleChange}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Currency</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your currency"
                      name="currency"
                      value={formik.values.currency}
                      onChange={formik.handleChange}
                    />
                  </Form.Group>
                  <br />
                </Col>
              </Row>

              {/* Buttons */}
              <div className="mt-4">
                <Button type="submit" variant="primary" className="rounded-pill px-4">
                  Save Changes
                </Button>
              </div>
            </Form>
          )
        }
        
      </Col>
    </Row>
  );
}