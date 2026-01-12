# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue. Instead, please report it via one of the following methods:

1. **Email**: Send details to [security@example.com] (replace with your security email)
2. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature

### What to Include

When reporting a vulnerability, please include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Depends on severity and complexity

## Security Best Practices

### For Contributors

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Review code changes for security implications
- Follow secure coding practices

### For Users

- Keep dependencies up to date
- Review and validate code before execution
- Use the latest version of the application
- Report security issues responsibly

## Code Execution Security

This project allows users to execute code in a sandboxed environment. We implement multiple security measures:

1. **Code Sanitization**: Pattern-based filtering of dangerous operations
2. **Rate Limiting**: Prevents abuse of execution endpoints
3. **Resource Limits**: Timeouts and output size limits
4. **Sandboxing**: Code runs in isolated environments via Piston API

However, **no system is 100% secure**. Use this project at your own risk, especially when executing untrusted code.

## Known Limitations

- Code sanitization is pattern-based and may have false positives/negatives
- Rate limiting is in-memory and resets on server restart
- No authentication/authorization for code execution
- Piston API is a third-party service with its own security considerations

## Security Updates

Security updates will be released as patch versions (e.g., 1.0.1, 1.0.2). Critical security fixes may be backported to previous versions.

## Acknowledgments

We appreciate responsible disclosure of security vulnerabilities. Contributors who report valid security issues will be credited (if desired).
