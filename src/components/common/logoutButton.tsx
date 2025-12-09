"use client"
import { signOut } from "next-auth/react"
import { Button } from "../ui/button"

function LogoutButton() {
  return (
    <Button variant="destructive" onClick={()=> signOut()}>
      Signout
    </Button>
  )
}

export default LogoutButton
