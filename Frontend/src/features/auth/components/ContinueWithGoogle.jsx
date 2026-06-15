

const ContinueWithGoogle = () => {
  return (
    <>
      {/* Divider */}
      <div style={styles.divider}>
        <div style={styles.dividerLine}></div>
        <span style={styles.dividerText}>or</span>
        <div style={styles.dividerLine}></div>
      </div>

      {/* Google Sign-In Button — follows Google Identity branding guidelines */}
      <a href="/api/auth/google" style={styles.button}>
        {/* Official Google "G" logo SVG */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>

        <span style={styles.buttonText}>Continue with Google</span>
      </a>
    </>
  )
}

const styles = {
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '32px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgb(38, 38, 38)', // neutral-800
  },
  dividerText: {
    padding: '0 16px',
    fontSize: '12px',
    color: 'rgb(115, 115, 115)', // neutral-500
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    height: '48px',
    padding: '0 24px',
    backgroundColor: '#ffffff',
    border: '1px solid #dadce0',
    borderRadius: '9999px', // pill shape per Google guidelines
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  },
  buttonText: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    color: '#1f1f1f',
    letterSpacing: '0.25px',
    lineHeight: '20px',
  },
}

export default ContinueWithGoogle