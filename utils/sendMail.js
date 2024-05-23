const nodeMailer = require("nodemailer");
const sendMail = async (user) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  });
  const html = `
  <html><head><style>body{font-family:Arial,sans-serif;padding:20px;background-color:#f4f4f4}.container{max-width:600px;margin:0 auto;background-color:#fff;padding:20px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,.1);text-align:center}.img{width:40px;height:40px;border-radius:100px}.img-container{display:block;margin-left:auto;margin-right:auto;width:50%}p{color:#333}.signature{margin-top:20px;text-align:right;font-style:italic;color:#777}</style></head><body><div class="container"><div class="img-container"><img class="img" src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704543841/_ff1966da-e14a-481e-bcff-a35df6e3b0c6_jjmhxy.jpg" alt="Course Management Logo"></div><p style="text-align:center;font-size:14px;color:#484848">Dear ${user.name},</p><div class="img-container"><img style="width:183px;height:139px" src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704545168/unnamed_la8l7s.png"></div><p style="text-align:center;font-size:20px;font-weight:700;color:#484848"><span style="color:#222;background-color:#fde293">Congratulations!</span>Your role has been updated to ${user.role}.</p><span style="text-align:center;font-size:14px;color:#484848">Now, you have additional privileges and responsibilities. Please feel free to explore the new features available to you.</span><div class="signature"><p>Best regards,</p><p style="font-weight:700">Course Managment Team</p></div></div></body></html>
    `;
  const mailOptions = {
    from: process.env.MAIL,
    to: user.email,
    subject: ` Congratulations ${user.name}! Your role has been updated to ${user.role}`,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

const sendVerificationEmail = async (user, token) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  });
  const html = `
    <html><head><style>body{font-family:Arial,sans-serif;padding:20px;background-color:#f4f4f4}.container{max-width:600px;margin:0 auto;background-color:#fff;padding:20px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,.1);text-align:center}.img{width:40px;height:40px;border-radius:100px}.img-container{display:block;margin-left:auto;margin-right:auto;width:50%}p{color:#333}.signature{margin-top:20px;text-align:right;font-style:italic;color:#777}</style></head><body><div class="container"><div class="img-container"><img class="img" src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704543841/_ff1966da-e14a-481e-bcff-a35df6e3b0c6_jjmhxy.jpg" alt="Course Management Logo"></div><p style="text-align:center;font-size:14px;color:#484848">Dear ${user.name},</p><div class="img-container"><img style="width:183px;height:139px" src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704545168/unnamed_la8l7s.png"></div>
    <p style="color: green; font-size: 18px; font-weight: bold;">
    Thank You for being a part of Course Management! 🎉
</p>
    <p style="text-align:center;font-size:20px;font-weight:700;color:#484848">Verify Email Adress</p><span style="text-align:center;font-size:14px;color:#484848">Please click the button below to verify your email address.</span><a href="https://starlit-zuccutto-9d1e7d.netlify.app/verify-email/${token}" style="display:block;padding:10px 20px;background-color:#ff1966;color:#fff;border-radius:5px;text-decoration:none;margin-top:20px;margin-bottom:20px">Verify Email</a></div></body></html>
        `;
  const mailOptions = {
    from: process.env.MAIL,
    to: user.email,
    subject: ` Dear ${user.name}! please verify your email`,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

const sendForgotPasswordEmail = async (user, code) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  });
  const html = `
        <html><head><style>body{font-family:Arial,sans-serif;padding:20px;background-color:#f4f4f4}.container{max-width:600px;margin:0 auto;background-color:#fff;padding:20px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,.1);text-align:center}.img{width:40px;height:40px;border-radius:100px}.img-container{display:block;margin-left:auto;margin-right:auto;width:50%}p{color:#333}.signature{margin-top:20px;text-align:right;font-style:italic;color:#777}</style></head><body><div class="container"><div class="img-container"><img class="img" src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704543841/_ff1966da-e14a-481e-bcff-a35df6e3b0c6_jjmhxy.jpg" alt="Course Management Logo"></div><p style="text-align:center;font-size:14px;color:#484848">Dear ${user.name},</p><div class="img-container"><img style="width:183px;height:139px" src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704545168/unnamed_la8l7s.png"></div>
        <p style="color: green; font-size: 18px; font-weight: bold;">
        Thank You for being a part of Course Management! 
    </p>
        <p style="text-align:center;font-size:20px;font-weight:700;color:#484848">Reset Password</p><span style="text-align:center;font-size:14px;color:#484848">Please enter the following code to reset your password.</span><p style="text-align:center;font-size:40px;font-weight:900;color:#484848">${code}</p></div></body></html>
            `;
  const mailOptions = {
    from: process.env.MAIL,
    to: user.email,
    subject: ` Dear ${user.name}! use this code to reset your password`,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};
const sendAssignmentMark = async (user, assignment, note) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  });
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background-color: #f4f4f4;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, .1);
              text-align: center;
          }
  
          .img {
              width: 40px;
              height: 40px;
              border-radius: 100px;
          }
  
          .img-container {
              display: block;
              margin-left: auto;
              margin-right: auto;
              width: 50%;
          }
  
          p {
              color: #333;
          }
  
          .signature {
              margin-top: 20px;
              text-align: right;
              font-style: italic;
              color: #777;
          }
  
          .note {
              background-color: #ffeeba;
              padding: 10px;
              border-radius: 5px;
              margin-top: 20px;
              font-size: 16px;
              color: #856404;
          }
  
          .mark {
              color: green;
              font-size: 18px;
              font-weight: bold;
          }
      </style>
  </head>
  <body>
  <div class="container">
      <div class="img-container">
          <img class="img" src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704543841/_ff1966da-e14a-481e-bcff-a35df6e3b0c6_jjmhxy.jpg" alt="Course Management Logo">
      </div>
      <p style="text-align:center;font-size:14px;color:#484848">Dear ${user.name},</p>
      <div class="img-container">
          <img style="width:183px;height:139px" src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704545168/unnamed_la8l7s.png">
      </div>
      <p class="mark">
          Thank You for being a part of Course Management!
      </p>
      <p style="text-align:center;font-size:20px;font-weight:700;color:#484848">Assignment Mark</p>
      <span style="text-align:center;font-size:14px;color:#484848">Your assignment has been marked. Your marks are <span class="font-size:24px;font-weight:900">${assignment}</span> out of <span class="font-size:24px;font-weight:900"> 60 </span></span>
      <div class="note">
          Note: ${note}
      </div>
  </div>
  </body>
  </html>
  
            `;
  const mailOptions = {
    from: process.env.MAIL,
    to: user.email,
    subject: ` Dear ${user.name}! Your assignment has been marked`,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  sendMail,
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendAssignmentMark,
};
