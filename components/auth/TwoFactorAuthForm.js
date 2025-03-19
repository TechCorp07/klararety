"use client"

import { useState } from "react"
import Link from "next/link"

export default function TwoFactorAuthForm({ onSubmit, loading }) {
  const [token, setToken] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(token)
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
      <p className="text-sm text-gray-600 mb-4">Please enter the 6-digit code from your authenticator app.</p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="token" className="sr-only">
              Authentication Code
            </label>
            <input
              id="token"
              name="token"
              type="text"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="6"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => setToken(e.target.value)}
              value={token}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || token.length !== 6}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
          Back to login
        </Link>
      </div>
    </div>
  )
}

