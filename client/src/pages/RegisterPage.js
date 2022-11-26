import {useEffect, useState} from "react"
import register from "../api/register"

function RegisterPage ({setLogin}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isAdmin, setAdminFlag] = useState(false)

    const [showErr, setShowErr] = useState(false)

    const onSubmit = async () => {
        try {
            const registerRes = await register(username, password, email, isAdmin ? "Admin" : "User")
            console.log('registerRes', registerRes)
            setLogin(undefined)
        } catch (err) { 
            setShowErr(true)
        }
    }

    return (
        <>
            <label style={{display: "block"}}>
                Username:
                <input type="text" name="username" onChange={(e) => {setUsername(e.target.value.trim().toLowerCase())}}/>
            </label>
            <label style={{display: "block"}}>
                Password:
                <input type="password" name="password" onChange={(e) => {setPassword(e.target.value.trim().toLowerCase())}}/>
            </label>
            <label style={{display: "block"}}>
                Email:
                <input type="text" name="email" onChange={(e) => {setEmail(e.target.value.trim().toLowerCase())}}/>
            </label>
            <input type="checkbox" id="isAdmin" name="isAdmin" value="Boat" onClick={() => {setAdminFlag(!isAdmin)}}/>
            <label htmlFor="isAdmin"> Administrator</label>

            <button type="button" value="Submit" onClick={onSubmit}>Register</button>
            <button type="button" value="Login" onClick={() => {setLogin(undefined)}}>Login</button>
            {showErr && <p>Something went wrong! Please try again</p>}
        </>
    )
}

export default RegisterPage