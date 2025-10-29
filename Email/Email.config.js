import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "autimate2245@gmail.com",
    pass: "ytuc bakh zowr ytxw",
  },
});


  
