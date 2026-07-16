import { useState } from "react";
import {
  isEmail,
  isNotEmpty,
  getPasswordStrength,
  bothAreEqual,
} from "../util/validation";
function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    skills: [],
    country: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        type === "checkbox"
          ? checked
            ? [...prevState[name], value]
            : prevState[name].filter((v) => v !== value)
          : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }
  const passwordStrength = getPasswordStrength(formData.password);

  function validate(formData) {
    const newErrors = {};
    if (!isNotEmpty(formData.name)) {
      newErrors.name = "Name is required";
    }
    if (!isNotEmpty(formData.email)) {
      newErrors.email = "Email is required";
    } else if (!isEmail(formData.email)) {
      newErrors.email = "Email format incorrect";
    }
    if (
      formData.password &&
      getPasswordStrength(formData.password) === "Weak"
    ) {
      newErrors.password = "Password is too weak";
    } else if (
      formData.password &&
      getPasswordStrength(formData.password) === "Medium"
    ) {
      newErrors.password = "Password is not strong enough";
    }
    if (!isNotEmpty(formData.confirmPassword)) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (!bothAreEqual(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    if (!isNotEmpty(formData.gender)) {
      newErrors.gender = "Gender is required";
    }
    if (!isNotEmpty(formData.country)) {
      newErrors.country = "Country is required";
    }
    if (formData.skills.length === 0) {
      newErrors.skills = "Skills are required";
    }
    return newErrors;
  }
  function handleEmailBlur(event) {
    event.preventDefault();
    const emailErrors = { ...errors };
    if (!isNotEmpty(formData.email)) {
      emailErrors.email = "Email is required";
    } else if (!isEmail(formData.email)) {
      emailErrors.email = "Email format incorrect";
    } else {
      delete emailErrors.email;
    }

    setErrors(emailErrors);
  }
  function handleCFMBlur(event) {
    event.preventDefault();
    const CfmErrors = { ...errors }; // start from current errors

    if (!isNotEmpty(formData.confirmPassword)) {
      CfmErrors.confirmPassword = "Fill confirm password correctly";
    } else if (!bothAreEqual(formData.password, formData.confirmPassword)) {
      CfmErrors.confirmPassword = "Passwords don't match";
    } else {
      delete CfmErrors.confirmPassword; // explicitly clear it when valid
    }

    setErrors(CfmErrors);
  }
  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log(formData);
      alert("✅ Registration Successful");
      handleReset();
      return;
    }
  }

  function handleReset() {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      skills: [],
      country: "",
    });
    setErrors({});
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Welcome on board!</h2>
        <p>We just need a little bit of data from you to get you started 🚀</p>

        <div className="control">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="control">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="passwords-wrapper">
          <div className="control">
            <label htmlFor="password">password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formData.password && (
              <span
                className={`strength strength-${passwordStrength.toLowerCase()}`}
              >
                {passwordStrength}
              </span>
            )}
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>
          <div className="control">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleCFMBlur}
              required
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>
        </div>

        <div className="control">
          <label htmlFor="gender">Gender</label>
          <label>
            <input
              type="radio"
              name="gender"
              id="male"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
              required
            />
            Male
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              id="female"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
              required
            />
            Female
          </label>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>
        <div className="control">
          <label htmlFor="country">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            id="country"
          >
            <option value="">Select...</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="Japan">Japan</option>
            <option value="Australia">Australia</option>
          </select>
        </div>

        <fieldset>
          <legend>What are Your Skills?</legend>
          <div className="control">
            <input
              type="checkbox"
              name="skills"
              id="reading"
              value="Reading"
              checked={formData.skills.includes("Reading")}
              onChange={handleChange}
            />
            <label htmlFor="reading">Reading</label>
          </div>

          <div className="control">
            <input
              type="checkbox"
              name="skills"
              value="Coding"
              id="coding"
              checked={formData.skills.includes("Coding")}
              onChange={handleChange}
            />
            <label htmlFor="coding">Coding</label>
          </div>

          <div className="control">
            <input
              type="checkbox"
              name="skills"
              id="communication"
              value="Communication"
              checked={formData.skills.includes("Communication")}
              onChange={handleChange}
            />
            <label htmlFor="communication">Communication</label>
          </div>
          {errors.skills && <span className="error">{errors.skills}</span>}
        </fieldset>
        <p className="form-actions">
          <button
            onClick={handleReset}
            type="reset"
            className="button button-flat"
          >
            Reset
          </button>
          <button type="submit" className="button">
            Register
          </button>
        </p>
      </form>
    </>
  );
}

export default Register;
