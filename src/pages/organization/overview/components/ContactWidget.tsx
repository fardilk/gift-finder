import React from 'react';

type ContactInfo = {
	email: string;
	phone: string;
	website: string;
};

type ContactWidgetProps = {
	contact: ContactInfo;
};

export function ContactWidget({ contact }: ContactWidgetProps) {
	return (
		<div className="rounded-xl bg-white p-6 shadow-sm min-w-0">
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
						<i className="fa-solid fa-envelope text-purple-600"></i>
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-xs text-gray-500">Email</p>
						<p className="font-semibold text-gray-900 truncate">{contact.email}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
						<i className="fa-solid fa-phone text-blue-600"></i>
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-xs text-gray-500">Phone</p>
						<p className="font-semibold text-gray-900 truncate">{contact.phone}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
						<i className="fa-solid fa-globe text-green-600"></i>
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-xs text-gray-500">Website</p>
						<a
							href={contact.website}
							target="_blank"
							rel="noopener noreferrer"
							className="font-semibold text-purple-600 hover:underline truncate block"
						>
							{contact.website}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ContactWidget;
