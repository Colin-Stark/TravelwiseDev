import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import { ThemeContext } from "./_app";
import UserSidebar from "/components/UserSidebar";
import * as formik from "formik";
import * as yup from "yup";

export default function Profile() {
  const { theme } = useContext(ThemeContext);
  const { Formik } = formik;

  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState("");

  // Validation schema
  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string(),
    emergencyContact: yup.string().required("Emergency contact is required"),
    language: yup.string(),
    currency: yup.string(),
    password: yup.string().min(8, "Password must be at least 8 characters"),
  });

  async function handleSubmit(values) {
    try {
      console.log("Profile updated:", values);
      setWarning("");
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setSuccess("");
      setWarning("Failed to update profile");
    }
  }

  return (
    <Row className="m-0 p-4">
      {/* Sidebar */}
      { <Col md={3}>
        <UserSidebar />
      </Col> }

      {/* Profile Form */}
      <Col
        md={9}
        className={`${theme === "dark" ? "bg-black text-white" : "bg-light text-dark"} p-5`}
      >
        <h2 className="mb-4">Profile</h2>

        <Formik
          validationSchema={schema}
          onSubmit={(values) => handleSubmit(values)}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            emergencyContact: "",
            language: "",
            currency: "",
            password: "",
          }}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
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
                      value={values.firstName}
                      onChange={handleChange}
                      isInvalid={!!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your last name"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your phone number"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Emergency Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your emergency contact number"
                      name="emergencyContact"
                      value={values.emergencyContact}
                      onChange={handleChange}
                    />
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
                      value={values.language}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Currency</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your currency"
                      name="currency"
                      value={values.currency}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <br />
                </Col>
              </Row>

              {/* Security */}
              <h5 className="mt-3">Security</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Buttons */}
              <div className="mt-4">
                <Button type="submit" variant="primary" className="rounded-pill px-4">
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
}
