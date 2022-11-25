import React, {useState} from "react";
import login from "../api/login"

function LoginPage({setLogin}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [showErr, setShowErr] = useState(false)

    const onSubmit = async () => {
        try {
            const loginRes = await login(username, password)
            setLogin(loginRes.data.userType)
            document.cookie = `userType=${loginRes.data.userType}`
            document.cookie = `token=${loginRes.data.token}`
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
            <button type="button" value="Submit" onClick={onSubmit}>Submit</button>
            {showErr && <p>Something went wrong! Please try again</p>}
        </>
    )
}

export default LoginPage;