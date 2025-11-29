# Members & Clusters Management System

This directory contains a comprehensive member and cluster management system with full CRUD operations and bidirectional relationships.

## 📁 Folder Structure

```
src/pages/organization/
├── members/
│   ├── index.tsx                    # Main members page with add form
│   ├── MemberDetailPage.tsx         # Member detail page wrapper
│   ├── components/
│   │   ├── ProfileWidget.tsx        # Profile info (photo, name, DOB, age)
│   │   ├── AddressWidget.tsx        # Address information
│   │   ├── GiftHistoryWidget.tsx    # Gift history with status badges
│   │   └── ClusterWidget.tsx        # Cluster assignment management
│   ├── forms/
│   │   └── AddMemberForm.tsx        # Add member with 3 modes (manual/excel/email)
│   └── views/
│       ├── MemberList.tsx           # Member list with search & filters
│       └── MemberDetail.tsx         # Member detail with 4 widgets
├── clusters/
│   ├── index.tsx                    # Main clusters page with create form
│   ├── ClusterDetailPage.tsx       # Cluster detail page wrapper
│   ├── forms/
│   │   └── ClusterForm.tsx         # Create/edit cluster form
│   └── views/
│       ├── ClusterList.tsx         # Cluster list with grid/table view
│       └── ClusterDetail.tsx       # Cluster detail with member list
├── members.tsx                      # Legacy file (now exports from members/)
└── clusters.tsx                     # Legacy file (now exports from clusters/)
```

## ✨ Features

### Members Management

#### Add Member Form (3 Modes)
- **Manual Entry**: Full form with personal info and address
- **Excel Upload**: Bulk import via Excel file with template download
- **Email Invitation**: Send invitations to multiple emails

#### Member List
- Search by name or email
- Filter by status (active/pending/inactive)
- Eye icon to view details
- Edit and delete actions
- Shows cluster assignments

#### Member Detail (4 Widgets)
1. **ProfileWidget**: Photo, name, date of birth, calculated age
2. **AddressWidget**: Street, city, state, zip code, country
3. **GiftHistoryWidget**: Gift history with occasion, date, status
4. **ClusterWidget**: Assign/remove clusters with bidirectional updates

### Clusters Management

#### Create/Edit Cluster Form
- Cluster name and description
- Color theme selection (8 colors)
- Visual color picker

#### Cluster List
- Two view modes: Grid and Table
- Search functionality
- Statistics cards (total clusters, total members, avg members/cluster)
- View, edit, and delete actions

#### Cluster Detail
- Cluster information card
- Member list with photos
- Add members with search
- Remove members
- View member details link
- Bidirectional relationship updates

## 🔄 Bidirectional Relationships

### Member → Cluster
When you assign a member to a cluster:
- ✅ Member's cluster list is updated
- ✅ Cluster's member count increases
- ✅ Member appears in cluster's member list

### Cluster → Member
When you add a member to a cluster:
- ✅ Cluster's member list is updated
- ✅ Member's cluster list includes the new cluster
- ✅ Changes sync in both directions

## 🎯 Toast Notifications

All CRUD operations show success toasts using Sonner:
- ✅ Add member (all 3 modes)
- ✅ Delete member
- ✅ Create cluster
- ✅ Edit cluster
- ✅ Delete cluster
- ✅ Assign member to cluster
- ✅ Remove member from cluster

Toast helper: `src/shared/components/toast/successToast.ts`

## 🎨 UI Components

### Widgets
- Modular and reusable
- Empty state handling
- Icon-based visual design
- Responsive layouts

### Forms
- Tab-based navigation (member form)
- File upload support (Excel)
- Multi-line email input
- Color picker (cluster form)
- Validation and error handling

### Lists
- Search and filter capabilities
- Responsive tables/grids
- Status badges
- Action buttons with icons
- Empty states

## 📝 Data Structure

### Member Type
```typescript
{
  id: number;
  photo?: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  phone?: string;
  role?: string;
  status: 'active' | 'pending' | 'inactive';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  gifts?: Array<{
    id: number;
    name: string;
    occasion: string;
    date: string;
    status: 'given' | 'pending' | 'planned';
  }>;
  clusters?: Array<{
    id: number;
    name: string;
    color?: string;
    memberCount?: number;
  }>;
}
```

### Cluster Type
```typescript
{
  id: number;
  name: string;
  description?: string;
  color?: string;
  memberCount: number;
  members: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    role?: string;
  }>;
}
```

## 🚀 Next Steps (TODO)

1. **Replace mock data with actual API calls**
   - Implement member CRUD endpoints
   - Implement cluster CRUD endpoints
   - Implement cluster-member relationship endpoints

2. **Add routing**
   - `/organization/members` - List page
   - `/organization/members/:id` - Detail page
   - `/organization/members/:id/edit` - Edit page
   - `/organization/clusters` - List page
   - `/organization/clusters/:id` - Detail page
   - `/organization/clusters/:id/edit` - Edit page

3. **Enhance features**
   - Excel template generation
   - Email sending functionality
   - Photo upload for members
   - Pagination for large lists
   - Sorting options
   - Bulk operations

4. **Add state management**
   - Consider React Query for data fetching
   - Or integrate with existing Redux store

## 🎓 Usage Example

```tsx
// In your routes configuration
import MembersPage from '@/pages/organization/members';
import MemberDetailPage from '@/pages/organization/members/MemberDetailPage';
import ClustersPage from '@/pages/organization/clusters';
import ClusterDetailPage from '@/pages/organization/clusters/ClusterDetailPage';

// Routes
<Route path="/organization/members" element={<MembersPage />} />
<Route path="/organization/members/:id" element={<MemberDetailPage />} />
<Route path="/organization/clusters" element={<ClustersPage />} />
<Route path="/organization/clusters/:id" element={<ClusterDetailPage />} />
```

## 🔧 Customization

### Colors
Cluster colors are defined in `ClusterForm.tsx`:
- Purple, Blue, Green, Red, Yellow, Pink, Indigo, Orange

### Status Types
Member status types in `MemberList.tsx`:
- active (green badge)
- pending (yellow badge)
- inactive (gray badge)

### Gift Status
Gift status types in `GiftHistoryWidget.tsx`:
- given (green badge)
- pending (yellow badge)
- planned (blue badge)

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and Sonner
