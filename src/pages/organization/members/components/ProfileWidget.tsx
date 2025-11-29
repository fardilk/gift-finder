import React from 'react';

interface ProfileWidgetProps {
	member: {
		id: number;
		photo?: string;
		firstName: string;
		lastName: string;
		dateOfBirth?: string;
	};
}

export default function ProfileWidget({ member }: ProfileWidgetProps) {
	const calculateAge = (dob?: string) => {
		if (!dob) return null;
		const birthDate = new Date(dob);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	const age = calculateAge(member.dateOfBirth);

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 className="mb-4 text-lg font-semibold text-gray-900">Profile Information</h3>
			<div className="flex items-start space-x-4">
				<div className="flex-shrink-0">
					{member.photo ? (
						<img
							src={member.photo}
							alt={`${member.firstName} ${member.lastName}`}
							className="h-24 w-24 rounded-full object-cover"
						/>
					) : (
						<div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100">
							<span className="text-3xl font-semibold text-purple-600">
								{member.firstName[0]}
								{member.lastName[0]}
							</span>
						</div>
					)}
				</div>
				<div className="flex-1">
					<h4 className="text-xl font-bold text-gray-900">
						{member.firstName} {member.lastName}
					</h4>
					<div className="mt-3 space-y-2">
						{member.dateOfBirth && (
							<div className="flex items-center text-sm text-gray-600">
								<i className="fa-solid fa-cake-candles mr-2 w-5"></i>
								<span>{new Date(member.dateOfBirth).toLocaleDateString()}</span>
							</div>
						)}
						{age !== null && (
							<div className="flex items-center text-sm text-gray-600">
								<i className="fa-solid fa-hourglass-half mr-2 w-5"></i>
								<span>{age} years old</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
