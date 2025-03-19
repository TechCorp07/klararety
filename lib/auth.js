import Cookies from "js-cookie"

const SESSION_DURATION = Number.parseInt(process.env.SESSION_MAX_AGE || "900") // 15 minutes in seconds

// Store authentication token and user data
export const setAuthData = (token, user) => {
  Cookies.set("auth_token", token, {
    expires: new Date(new Date().getTime() + SESSION_DURATION * 1000),
    secure: process.env.SECURE_COOKIES === "true",
    sameSite: "strict",
  })

  Cookies.set("user", JSON.stringify(user), {
    expires: new Date(new Date().getTime() + SESSION_DURATION * 1000),
    secure: process.env.SECURE_COOKIES === "true",
    sameSite: "strict",
  })

  if (typeof window !== "undefined") {
    window.authTimeout = setTimeout(() => {
      logout()
    }, SESSION_DURATION * 1000)
  }
}

// Refresh the auto-logout timer on user activity
export const refreshAuthTimeout = () => {
  if (typeof window !== "undefined") {
    // Clear existing timeout
    if (window.authTimeout) {
      clearTimeout(window.authTimeout)
    }

    // Set new timeout
    window.authTimeout = setTimeout(() => {
      logout()
    }, SESSION_DURATION * 1000)

    // Refresh cookies expiration
    const token = Cookies.get("auth_token")
    const user = Cookies.get("user")

    if (token && user) {
      Cookies.set("auth_token", token, {
        expires: new Date(new Date().getTime() + SESSION_DURATION * 1000),
        secure: process.env.SECURE_COOKIES === "true",
        sameSite: "strict",
      })

      Cookies.set("user", user, {
        expires: new Date(new Date().getTime() + SESSION_DURATION * 1000),
        secure: process.env.SECURE_COOKIES === "true",
        sameSite: "strict",
      })
    }
  }
}

// Clear auth data and redirect to login
export const logout = () => {
  Cookies.remove("auth_token")
  Cookies.remove("user")

  if (typeof window !== "undefined") {
    // Clear timeout
    if (window.authTimeout) {
      clearTimeout(window.authTimeout)
    }

    // Redirect to login if not already there
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login"
    }
  }
}

// Get current user from cookie
export const getCurrentUser = () => {
  const userCookie = Cookies.get("user")
  if (!userCookie) return null

  try {
    return JSON.parse(userCookie)
  } catch (e) {
    console.error("Error parsing user data:", e)
    return null
  }
}

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = Cookies.get("auth_token")
  const user = Cookies.get("user")

  return !!token && !!user
}

// Check if user has specific role
export const hasRole = (requiredRole) => {
  const user = getCurrentUser()
  return user && user.role === requiredRole
}

// Check if user has any of the specified roles
export const hasAnyRole = (allowedRoles) => {
  const user = getCurrentUser()
  return user && allowedRoles.includes(user.role)
}

// Initialize idle timer to track user inactivity
export const initIdleTimer = () => {
  if (typeof window !== "undefined") {
    // Define events to reset the idle timer
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, refreshAuthTimeout)
    })

    // Initial setup of timeout
    refreshAuthTimeout()

    // Return cleanup function
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, refreshAuthTimeout)
      })

      if (window.authTimeout) {
        clearTimeout(window.authTimeout)
      }
    }
  }

  return () => {}
}

