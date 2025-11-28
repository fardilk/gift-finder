import React from 'react';
import { RouteObject } from 'react-router-dom';
import { wrapRoute } from '../utils';
const DemoFormPage = React.lazy(() => import('src/modules/demo/demo-form'));
const WelcomePage = React.lazy(() => import('src/pages/welcome'));
const RecommendationsPage = React.lazy(() => import('src/pages/recommendations'));
const GroupsPage = React.lazy(() => import('src/pages/groups/groups'));
const GroupRoomPage = React.lazy(() => import('src/pages/groups/groupRoom'));
const GroupCreatePage = React.lazy(() => import('src/pages/groups/groupCreate'));
const OccasionsPage = React.lazy(() => import('src/pages/occasion/occasions'));
const OccasionCreatePage = React.lazy(() => import('src/pages/occasion/occasionCreate'));
const OccasionRoomPage = React.lazy(() => import('src/pages/occasion/occasionRoom'));
const AffiliateSettingPage = React.lazy(() => import('src/pages/affiliate/settings'));
const AffiliateMasterPage = React.lazy(() => import('src/pages/affiliate/master'));
const IndividualDashboardPage = React.lazy(() => import('src/pages/dashboard'));
const PreviewComponentPage = React.lazy(() => import('src/pages/previewComponent'));
const AiRecommendationPage = React.lazy(() => import('src/pages/ai-recommendation'));
const ItemRecommendationDetailPage = React.lazy(() => import('src/pages/ai-recommendation/item-recommendation/itemRecommendationDetail'));
const MyProfilePage = React.lazy(() => import('src/pages/settings/profile'));
const AccountsPage = React.lazy(() => import('src/pages/settings/accounts'));
const UserManagementPage = React.lazy(() => import('src/pages/user-management/userManagement'));
const CreateUserPage = React.lazy(() => import('src/pages/user-management/detail/createUserForms'));
const ViewDetailUserPage = React.lazy(() => import('src/pages/user-management/detail/viewDetailUser'));
const OrganizationPage = React.lazy(() => import('src/pages/organization'));
const OrganizationOverviewPage = React.lazy(() => import('src/pages/organization/overview'));
const OrganizationProfilePage = React.lazy(() => import('src/pages/organization/profile'));
const OrganizationMembersPage = React.lazy(() => import('src/pages/organization/members'));
const OrganizationClustersPage = React.lazy(() => import('src/pages/organization/clusters'));
const OrganizationOccasionsPage = React.lazy(() => import('src/pages/organization/occasions'));
const OrganizationBenefitsPage = React.lazy(() => import('src/pages/organization/benefits'));
const OrganizationEventsPage = React.lazy(() => import('src/pages/organization/events'));
const OrganizationWalletPage = React.lazy(() => import('src/pages/organization/wallet'));

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/',
    element: wrapRoute(WelcomePage, 'Welcome', { useGlobalLayout: false }),
  },
  {
    path: '/groups',
    element: wrapRoute(GroupsPage, 'KYC Groups', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/groups/create',
    element: wrapRoute(GroupCreatePage, 'Create Group', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/groups/:groupId',
    element: wrapRoute(GroupRoomPage, 'Group Room', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/occasion',
    element: wrapRoute(OccasionsPage, 'Occasions', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/occasion/create',
    element: wrapRoute(OccasionCreatePage, 'Create Occasion', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/occasion/:occasionId',
    element: wrapRoute(OccasionRoomPage, 'Occasion Room', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/affiliate-setting',
    element: wrapRoute(AffiliateSettingPage, 'Affiliate Settings', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/affiliate-setting/master',
    element: wrapRoute(AffiliateMasterPage, 'Master Affiliate', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/dashboard',
    element: wrapRoute(IndividualDashboardPage, 'Individual Dashboard', { dashboardAccess: true, useGlobalLayout: true }),
  },
  {
    path: '/recommendations',
    element: wrapRoute(RecommendationsPage, 'Recommendations', { useGlobalLayout: true }),
  },
  {
    path: '/component',
    element: wrapRoute(PreviewComponentPage, 'Component Preview', { useGlobalLayout: true }),
  },
  {
    path: '/dashboard/ai-recommendation',
    element: wrapRoute(AiRecommendationPage, 'AI Recommendation', { useGlobalLayout: true }),
  },
  {
    path: '/ai-recommendation', // alias to match backend menu URL
    element: wrapRoute(AiRecommendationPage, 'AI Recommendation', { useGlobalLayout: true }),
  },
  {
    path: '/ai-recommendation/:itemId',
    element: wrapRoute(ItemRecommendationDetailPage, 'Recommendation Detail', { useGlobalLayout: true }),
  },
  {
    path: '/profile',
    element: wrapRoute(MyProfilePage, 'My Profile', { useGlobalLayout: true }),
  },
  {
    path: '/dashboard/settings/accounts',
    element: wrapRoute(AccountsPage, 'Accounts', { useGlobalLayout: true }),
  },
  {
    path: '/settings/accounts',
    element: wrapRoute(AccountsPage, 'Accounts', { useGlobalLayout: true }),
  },
  {
    path: '/user-management',
    element: wrapRoute(UserManagementPage, 'User Management', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/user-management/create',
    element: wrapRoute(CreateUserPage, 'Create User', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/user-management/:userId',
    element: wrapRoute(ViewDetailUserPage, 'User Detail', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/individuals',
    element: wrapRoute(IndividualDashboardPage, 'KYC Individuals', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/about',
    element: (
      <div className="p-8">About page</div>
    ),
  },
  {
    path: '/demo-form',
    element: wrapRoute(DemoFormPage, 'Demo Form', { useGlobalLayout: true }),
  },
  {
    path: '/organizations',
    element: wrapRoute(OrganizationPage, 'Organizations', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/organizations/overview',
    element: wrapRoute(OrganizationOverviewPage, 'Organization Overview', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/organizations/profile',
    element: wrapRoute(OrganizationProfilePage, 'Organization Profile', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/organizations/members',
    element: wrapRoute(OrganizationMembersPage, 'Organization Members', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/organizations/clusters',
    element: wrapRoute(OrganizationClustersPage, 'Organization Clusters', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/organizations/occasions',
    element: wrapRoute(OrganizationOccasionsPage, 'Organization Occasions', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/organizations/benefits',
    element: wrapRoute(OrganizationBenefitsPage, 'Organization Benefits', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/organizations/events',
    element: wrapRoute(OrganizationEventsPage, 'Organization Events', { authOnly: true, useGlobalLayout: true }),
  },
  {
    path: '/organizations/wallet',
    element: wrapRoute(OrganizationWalletPage, 'Organization Wallet', { authOnly: true, useGlobalLayout: true }),
  },
];
