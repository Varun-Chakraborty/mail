// file to handle emails
import nodemailer, { type SendMailOptions } from 'nodemailer';

class Email {
	private _transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_ADDRESS,
			pass: process.env.GMAIL_PASSWORD,
		},
	});
	private readonly _myEmail: string = process.env.MY_EMAIL_ADDRESS as string;
	private _mailOptions: SendMailOptions | undefined;

	constructor() {
		this._transporter.verify((error, success) => {
			if (error) {
				console.error('Email verification error:', error);
			} else {
				console.log('Email configured successfully');
			}
		});
		if (!this._transporter) throw new Error('Email transporter is not initialized');
	}

	/**
	 * Send an email
	 * @param to
	 * @param subject
	 * @param text HTML text
	 */
	async send(to: string, subject: string, text: string) {
		this._mailOptions = {
			from: this._myEmail,
			to,
			subject,
			html: `${text}<br><hr>P.S. If you enjoyed the project, a ⭐ on GitHub or a share on Twitter would mean a lot. Thanks!`,
		};
		if (!this._mailOptions) throw new Error('Email options are not initialized');
		this._transporter.sendMail(this._mailOptions, (err, info) => {
			if (err) {
				console.error('Error sending email:', err);
			} else {
				console.log('Email sent successfully');
			}
		});
	}
}

let emailClient: Email | null = null;

export function getEmailInstance() {
	if (!emailClient) {
		emailClient = new Email();
	}
	return emailClient;
}
