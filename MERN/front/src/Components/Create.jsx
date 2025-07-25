import axios from 'axios'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

export const Create = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [passw, setPassw] = useState("")
  const [age, setAge] = useState(1)

  async function SubmitFunc() {
    try {
      const user_regex = /^[a-zA-Z0-9_]{3,16}$/
      const pass_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/

      if (!name || !email || !passw || age <= 0 ) {
        toast.error("All Fields are Required")
        return
      }

      if (!user_regex.test(name)) {
        toast.error("Invalid Username")
        return
      }
      if (!pass_regex.test(passw)) {
        toast.error("Password Must Be Strong")
        return
      }

      await axios.post("http://localhost:3008/save", {
        Name: name,
        Email: email,
        Passw: passw,
        Age: age


      }).then(() => {
        toast.success("Data Saved Succesfully")
      }).catch((e) => {
        if (e.status === 409) {
          alert(e.response.data.msg)

        } else {
          console.log(e.message)
        }

      })

    } catch (error) {
      console.log(error)

    }

  }
  return (
    <div>
      <div class="container mt-5">
      <ToastContainer/>
        <h2>Registration Form</h2>
        <form>
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Enter your password" value={passw} onChange={(e) => setPassw(e.target.value)} />
          </div>
          <div class="mb-3">
            <label for="age" class="form-label">Age</label>
            <input type="number" class="form-control" id="age" placeholder="Enter your age" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <button type="button" class="btn btn-primary" onClick={SubmitFunc}>Submit</button>
        </form>
      </div>

    </div>
  )
}
