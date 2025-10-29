export const Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account - Final Year Project</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              padding: 20px;
              color: #333;
          }
          
          .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }
          
          .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
          }
          
          .header h1 {
              font-size: 24px;
              margin-bottom: 5px;
          }
          
          .header p {
              font-size: 14px;
              opacity: 0.9;
          }
          
          .content {
              padding: 30px 20px;
          }
          
          .greeting {
              font-size: 18px;
              margin-bottom: 15px;
              color: #333;
          }
          
          .description {
              font-size: 14px;
              color: #666;
              line-height: 1.6;
              margin-bottom: 25px;
          }
          
          .verification-box {
              background: #f8f9ff;
              border: 2px solid #667eea;
              border-radius: 8px;
              padding: 25px;
              text-align: center;
              margin: 20px 0;
          }
          
          .verification-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
          }
          
          .verification-code {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 3px;
              font-family: monospace;
              margin: 10px 0;
          }
          
          .verification-link {
              margin-top: 20px;
          }
          
          .verify-button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 15px;
          }
          
          .verify-button:hover {
              background: #5a67d8;
          }
          
          .instructions {
              background: #f0f0f0;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
          }
          
          .instructions h3 {
              color: #333;
              font-size: 16px;
              margin-bottom: 10px;
          }
          
          .instructions ul {
              color: #666;
              font-size: 14px;
              padding-left: 20px;
          }
          
          .instructions li {
              margin-bottom: 5px;
          }
          
          .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              font-size: 13px;
              color: #856404;
          }
          
          .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e9ecef;
              font-size: 12px;
              color: #666;
          }
          
          @media (max-width: 600px) {
              .container {
                  margin: 10px;
              }
              
              .header {
                  padding: 20px 15px;
              }
              
              .content {
                  padding: 20px 15px;
              }
              
              .verification-code {
                  font-size: 24px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🎓 Final Year Project</h1>
              <p>Account Verification System</p>
          </div>
          
          <div class="content">
              <div class="greeting">Hello!</div>
              <div class="description">
                  Thank you for registering with our final year project system. To complete your account setup and ensure security, please verify your email address using the verification code below.
              </div>
              
              <div class="verification-box">
                  <div class="verification-label">Your Verification Code</div>
                  <div class="verification-code">{verificationCode}</div>
                  
                  <div class="verification-link">
                      <p style="margin: 15px 0; color: #666; font-size: 14px;">
                          Or click the button below to verify automatically:
                      </p>
                      <a href="{verificationLink}" class="verify-button">
                          Verify Account
                      </a>
                  </div>
              </div>
              
              <div class="instructions">
                  <h3>📋 How to Verify:</h3>
                  <ul>
                      <li>Copy the verification code above</li>
                      <li>Return to the registration page</li>
                      <li>Enter the code in the verification field</li>
                      <li>Click "Verify" to complete setup</li>
                  </ul>
              </div>
              
              <div class="warning">
                  <strong>⚠️ Important:</strong> This verification code will expire in 10 minutes for security purposes. If you didn't create an account, please ignore this email.
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 25px;">
                  Having trouble? Contact our support team or refer to the project documentation.
              </p>
          </div>
          
          <div class="footer">
              <p><strong>Final Year Project - Automated System</strong></p>
              <p>This is an automated email from our project system.</p>
              <p>&copy; ${new Date().getFullYear()} Academic Project. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

export const Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome - Final Year Project</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              padding: 20px;
              color: #333;
          }
          
          .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }
          
          .header {
              background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
          }
          
          .header h1 {
              font-size: 24px;
              margin-bottom: 5px;
          }
          
          .header p {
              font-size: 14px;
              opacity: 0.9;
          }
          
          .status-badge {
              display: inline-block;
              background: rgba(255, 255, 255, 0.2);
              padding: 5px 12px;
              border-radius: 15px;
              font-size: 12px;
              margin-top: 10px;
          }
          
          .content {
              padding: 30px 20px;
          }
          
          .greeting {
              font-size: 20px;
              margin-bottom: 15px;
              color: #333;
          }
          
          .username {
              color: #4CAF50;
              font-weight: bold;
          }
          
          .description {
              font-size: 14px;
              color: #666;
              line-height: 1.6;
              margin-bottom: 25px;
          }
          
          .features-section {
              background: #f8f9fa;
              border-radius: 8px;
              padding: 25px;
              margin: 25px 0;
              border-left: 4px solid #4CAF50;
          }
          
          .features-title {
              font-size: 18px;
              color: #333;
              margin-bottom: 15px;
              font-weight: bold;
          }
          
          .feature-list {
              list-style: none;
              padding: 0;
          }
          
          .feature-item {
              display: flex;
              align-items: flex-start;
              margin-bottom: 12px;
              font-size: 14px;
              color: #666;
          }
          
          .feature-icon {
              color: #4CAF50;
              margin-right: 10px;
              font-weight: bold;
          }
          
          .cta-section {
              text-align: center;
              margin: 30px 0;
              padding: 25px;
              background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
              border-radius: 8px;
          }
          
          .cta-title {
              font-size: 16px;
              color: #333;
              margin-bottom: 15px;
              font-weight: bold;
          }
          
          .cta-button {
              display: inline-block;
              background: #4CAF50;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 5px;
          }
          
          .cta-button:hover {
              background: #45a049;
          }
          
          .cta-button.secondary {
              background: #2196F3;
          }
          
          .cta-button.secondary:hover {
              background: #1976D2;
          }
          
          .info-section {
              background: #e3f2fd;
              border: 1px solid #bbdefb;
              border-radius: 5px;
              padding: 20px;
              margin: 20px 0;
          }
          
          .info-title {
              color: #1976D2;
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
          }
          
          .info-text {
              color: #333;
              font-size: 14px;
              line-height: 1.6;
          }
          
          .footer {
              background: #f8f9fa;
              padding: 25px 20px;
              text-align: center;
              border-top: 1px solid #e9ecef;
              font-size: 12px;
              color: #666;
          }
          
          .footer .project-info {
              margin-bottom: 10px;
              font-weight: bold;
              color: #333;
          }
          
          .divider {
              height: 1px;
              background: #e9ecef;
              margin: 20px 0;
          }
          
          @media (max-width: 600px) {
              .container {
                  margin: 10px;
              }
              
              .header {
                  padding: 20px 15px;
              }
              
              .content {
                  padding: 20px 15px;
              }
              
              .greeting {
                  font-size: 18px;
              }
              
              .cta-button {
                  display: block;
                  margin: 10px 0;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🎓 Final Year Project</h1>
              <p>Automated System</p>
              <div class="status-badge">✅ Account Verified</div>
          </div>
          
          <div class="content">
              <div class="greeting">
                  Welcome, <span class="username">{name}</span>! 🎉
              </div>
              
              <div class="description">
                  Congratulations! Your account has been successfully created and verified. You now have full access to our final year project system. This automated platform has been developed as part of our academic research and includes various features for demonstration and testing purposes.
              </div>
              
              <div class="features-section">
                  <div class="features-title">📚 Available Features</div>
                  <ul class="feature-list">
                      <li class="feature-item">
                          <span class="feature-icon">🔐</span>
                          <span>Secure user authentication system</span>
                      </li>
                      <li class="feature-item">
                          <span class="feature-icon">📊</span>
                          <span>Dashboard with analytics and monitoring</span>
                      </li>
                      <li class="feature-item">
                          <span class="feature-icon">⚙️</span>
                          <span>Automated workflow management</span>
                      </li>
                      <li class="feature-item">
                          <span class="feature-icon">📱</span>
                          <span>Responsive design for all devices</span>
                      </li>
                      <li class="feature-item">
                          <span class="feature-icon">🔔</span>
                          <span>Email notification system</span>
                      </li>
                  </ul>
              </div>
              
              <div class="cta-section">
                  <div class="cta-title">Ready to Explore? 🚀</div>
                  <a href="#" class="cta-button">Access Dashboard</a>
                  <a href="#" class="cta-button secondary">View Documentation</a>
              </div>
              
              <div class="divider"></div>
              
              <div class="info-section">
                  <div class="info-title">
                      💡 Need Help?
                  </div>
                  <div class="info-text">
                      This is an academic project created for educational purposes. If you encounter any issues or have questions about the system functionality, please refer to the project documentation or contact our development team.
                      <br><br>
                      <strong>Project Email:</strong> project.support@university.edu<br>
                      <strong>Documentation:</strong> Available in the system dashboard
                  </div>
              </div>
          </div>
          
          <div class="footer">
              <div class="project-info">🎓 Final Year Project - Automated System</div>
              <p>Developed as part of academic curriculum</p>
              <p>This email was automatically generated by our system.</p>
              <div style="margin-top: 15px;">
                  <p>&copy; ${new Date().getFullYear()} Academic Project. All rights reserved.</p>
              </div>
          </div>
      </div>
  </body>
  </html>
`;

// Basic Simple Templates (Alternative)
export const Basic_Verification_Template = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Verify Your Account</title>
      <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 5px; }
          .header { text-align: center; margin-bottom: 30px; }
          .code-box { background: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
          .code { font-size: 24px; font-weight: bold; color: #333; letter-spacing: 2px; }
          .button { display: inline-block; background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🎓 Final Year Project</h1>
              <h2>Email Verification</h2>
          </div>
          
          <p>Hello,</p>
          <p>Please verify your email address by using the code below:</p>
          
          <div class="code-box">
              <div class="code">{verificationCode}</div>
          </div>
          
          <p>Or click this button:</p>
          <p style="text-align: center;">
              <a href="{verificationLink}" class="button">Verify Email</a>
          </p>
          
          <p><small>This code expires in 10 minutes.</small></p>
          <hr>
          <p><small>Final Year Project - Automated Email System</small></p>
      </div>
  </body>
  </html>
`;

export const Basic_Welcome_Template = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Welcome to Our Project</title>
      <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 5px; }
          .header { text-align: center; margin-bottom: 30px; }
          .feature { margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 3px; }
          .button { display: inline-block; background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🎉 Welcome!</h1>
              <h2>Final Year Project System</h2>
          </div>
          
          <p>Hello <strong>{name}</strong>,</p>
          <p>Welcome to our final year project! Your account has been successfully created.</p>
          
          <h3>What's Available:</h3>
          <div class="feature">🔐 Secure Login System</div>
          <div class="feature">📊 Project Dashboard</div>
          <div class="feature">⚙️ Automated Features</div>
          <div class="feature">📱 Mobile Friendly</div>
          
          <p style="text-align: center; margin: 30px 0;">
              <a href="#" class="button">Get Started</a>
          </p>
          
          <hr>
          <p><small>This is an automated email from our final year project system.</small></p>
          <p><small>&copy; ${new Date().getFullYear()} Academic Project</small></p>
      </div>
  </body>
  </html>
`;