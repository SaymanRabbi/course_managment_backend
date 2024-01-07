const nodeMailer = require('nodemailer');
const sendMail = async (user) => {

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        port:465,
        secure:true,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS
        }
    });
  const  html = `
  <html>
  <head>
      <style>
          /* Add more custom styles for your email here */
          body {
              font-family: 'Arial', sans-serif;
              padding: 20px;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          .img {
              width: 40px;
              height: 40px;
              border-radius: 100px; /* Rounded corners for the logo */
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
      </style>
  </head>
  <body>
      <div class="container">
           <div
            class='img-container'>
           <img class='img' src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704543841/_ff1966da-e14a-481e-bcff-a35df6e3b0c6_jjmhxy.jpg" alt="Course Management Logo">
           </div>
            <p
             style="text-align: center; font-size: 14px; color: #484848;"
            >Dear ${user.name},</p>
            <div  class="img-container"> 
            <img style="
             width: 183px;
             height: 139px; " src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704545168/unnamed_la8l7s.png"></div>
            <p
             style="text-align: center; font-size: 20px; font-weight: 700; color: #484848;"
            ><span 
             style="color: #222; background-color: #fde293"
            >Congratulations!</span> Your role has been updated to ${user.role}.</p>
            <span
                style="text-align: center; font-size: 14px; color: #484848;"
            >
            Now, you have additional privileges and responsibilities. Please feel free to explore the new features available to you.
            </span>
          <div class="signature">
              <p>Best regards,</p>
              <p style=" 
                font-weight: bold;">Course Managment Team</p>
          </div>
      </div>
  </body>
</html>
    `
    const mailOptions = {
        from: process.env.MAIL,
        to: user.email,
        subject: ` Congratulations ${user.name}! Your role has been updated to Admin`,
        html
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new Error(error.message);
    }
}
module.exports = sendMail;


const sendVerificationEmail = async (user,token) => {
    
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            port:465,
            secure:true,
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS
            }
        });
    const  html = `
    <html>
    <head>
        <style>
            /* Add more custom styles for your email here */
            body {
                font-family: 'Arial', sans-serif;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .img {
                width: 40px;
                height: 40px;
                border-radius: 100px; /* Rounded corners for the logo */
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
        </style>
    </head>
    <body>
        <div class="container">
            <div
                class='img-container'>
            <img class='img' src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704543841/_ff1966da-e14a-481e-bcff-a35df6e3b0c6_jjmhxy.jpg" alt="Course Management Logo">
            </div>
                <p
                style="text-align: center; font-size: 14px; color: #484848;"
                >Dear ${user.name},</p>
                <div  class="img-container"> 
                <img style="
                width: 183px;
                height: 139px; " src="https://res.cloudinary.com/dnr5u3jpb/image/upload/v1704545168/unnamed_la8l7s.png"></div>
                <p
                style="text-align: center; font-size: 20px; font-weight: 700; color: #484848;"
                >Verify Email Adress</p>
                <span
                    style="text-align: center; font-size: 14px; color: #484848;"
                >
                Please click the button below to verify your email address.
                </span>
                <a href="${process.env.CLIENT_URL}/api/v1/user/verify-email/${token}" style="
                display: block;
                padding: 10px 20px;
                background-color: #ff1966;
                color: #fff;
                border-radius: 5px;
                text-decoration: none;
                margin-top: 20px;
                margin-bottom: 20px;
                ">Verify Email</a>

        </div>
    </body>
    </html>
        `
        const mailOptions = {
            from: process.env.MAIL,
            to: user.email,
            subject: ` Dear ${user.name}! please verify your email`,
            html
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            throw new Error(error.message);
        }
}
    module.exports = sendVerificationEmail;