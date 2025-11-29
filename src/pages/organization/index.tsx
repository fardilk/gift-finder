import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrganizationPage() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/organizations/overview', { replace: true });
	}, [navigate]);

	return null;
}
