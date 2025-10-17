# Planning Guide

Tik in de Buurt is a comprehensive local business platform that connects residents with local businesses in their neighborhood, offering both free browsing for users and premium business management tools for local entrepreneurs.

**Experience Qualities**: 
1. **Professional yet approachable** - The platform should feel trustworthy for business owners while remaining accessible to everyday users
2. **Community-focused** - Every interaction should emphasize local connections and neighborhood relationships
3. **Efficient and organized** - Clear navigation and purposeful features that help users accomplish their goals quickly

**Complexity Level**: 
- **Complex Application** (advanced functionality, accounts)
  - Supports dual user types with distinct feature sets, subscription management, comprehensive business tools, and real-time interactions

## Essential Features

### User Registration & Authentication
- **Functionality**: Dual registration system for regular users (free) and businesses (€14/month subscription)
- **Purpose**: Separates casual browsers from business owners, enabling targeted features for each audience
- **Trigger**: Landing page with clear path selection
- **Progression**: Account type selection → Form completion → Email verification → Dashboard access
- **Success criteria**: Users can register, login, and access appropriate dashboard based on account type

### Business Dashboard (Premium - €14/month)
- **Functionality**: Comprehensive business management suite with analytics, marketing tools, content management, and customer communication
- **Purpose**: Provides small businesses with professional tools to manage their local presence and marketing
- **Trigger**: Business registration and subscription payment
- **Progression**: Login → Dashboard overview → Feature navigation → Task completion → Performance tracking
- **Success criteria**: Business owners can manage listings, track analytics, communicate with customers, and run marketing campaigns

### User Dashboard (Free)
- **Functionality**: Browse local offerings, save favorites, communicate with businesses, manage personal profile
- **Purpose**: Enables residents to discover and engage with local businesses
- **Trigger**: User registration
- **Progression**: Login → Content feed → Business discovery → Interaction → Saved items management
- **Success criteria**: Users can browse content, save items, and interact with businesses

### Content Management System
- **Functionality**: Businesses can create and manage various content types (posts, photos, videos, promotions, real estate listings)
- **Purpose**: Allows businesses to showcase their services and engage customers
- **Trigger**: Business dashboard navigation
- **Progression**: Content creation → Preview → Publication → Performance monitoring
- **Success criteria**: Businesses can create, edit, and publish various content types with engagement tracking

### Local Discovery Feed
- **Functionality**: Algorithm-driven content feed showing relevant local business content based on user location and preferences
- **Purpose**: Helps users discover nearby businesses and current offerings
- **Trigger**: User dashboard access
- **Progression**: Feed loading → Content browsing → Business interaction → Profile exploration
- **Success criteria**: Users see relevant local content and engage with businesses

### Communication System
- **Functionality**: Real-time messaging between users and businesses, review system, push notifications, online status indicators, typing indicators, and message delivery confirmations
- **Purpose**: Facilitates instant customer-business relationships and community trust building with modern messaging experience
- **Trigger**: User interaction with business content or direct messaging initiation
- **Progression**: Contact initiation → Real-time message exchange → Typing indicators → Read receipts → Review/rating → Ongoing relationship with notification management
- **Success criteria**: Users and businesses can communicate effectively in real-time with proper notification systems, online presence indicators, and professional messaging interface

### Analytics & Reporting (Business Only)
- **Functionality**: Detailed insights into business performance, customer engagement, and marketing effectiveness
- **Purpose**: Helps businesses optimize their local marketing strategy
- **Trigger**: Business dashboard analytics section
- **Progression**: Data collection → Analysis → Insights presentation → Strategy adjustment
- **Success criteria**: Businesses can track KPIs and make data-driven decisions

## Edge Case Handling
- **Subscription Payment Failures**: Graceful downgrade with data preservation and clear upgrade path
- **Content Moderation**: Automated and manual review system for inappropriate content
- **Business Verification**: Process to verify legitimate businesses and prevent spam accounts
- **Data Privacy**: GDPR compliance with clear data handling and deletion options
- **Mobile Responsiveness**: Full functionality across all device sizes
- **Offline Access**: Basic content caching for poor connectivity scenarios

## Design Direction
The design should feel modern and professional like a premium business tool, while maintaining approachability for everyday users - clean interfaces with purposeful animations and a rich feature set that doesn't overwhelm through progressive disclosure.

## Color Selection
**Triadic** (three equally spaced colors) - Using professional blues, warm greens, and accent oranges to convey trust, growth, and energy while maintaining clear visual hierarchy.

- **Primary Color**: Deep Professional Blue (oklch(0.51 0.20 232.77)) - Communicates trust, reliability, and professionalism
- **Secondary Colors**: 
  - Soft Blue-Gray (oklch(0.94 0.008 258.09)) - Supporting neutral for backgrounds and secondary elements
  - Muted Green (oklch(0.21 0.20 156.57)) - Success states and positive actions
- **Accent Color**: Warm Orange (oklch(0.89 0.15 85.87)) - Call-to-action buttons and important highlights
- **Foreground/Background Pairings**:
  - Background (Light Blue-Gray #F7F8FA): Dark Blue text (oklch(0.175 0.03 258.09)) - Ratio 12.1:1 ✓
  - Primary Blue: White text (oklch(1 0 0)) - Ratio 8.9:1 ✓
  - Accent Orange: Dark Blue text (oklch(0.175 0.03 258.09)) - Ratio 6.2:1 ✓
  - Card White: Dark Blue text (oklch(0.175 0.03 258.09)) - Ratio 14.8:1 ✓

## Font Selection
Inter font family to convey modern professionalism with excellent readability across all languages and device sizes, particularly important for a multilingual platform serving Dutch markets.

- **Typographic Hierarchy**: 
  - H1 (Page Titles): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal letter spacing  
  - H3 (Card Titles): Inter Medium/18px/normal letter spacing
  - Body Text: Inter Regular/16px/relaxed line height (1.6)
  - Small Text: Inter Regular/14px/normal line height
  - Caption/Meta: Inter Medium/12px/tight letter spacing

## Animations
Subtle and functional animations that enhance usability without distraction - focused on state transitions, loading feedback, and navigation clarity appropriate for a business tool.

- **Purposeful Meaning**: Smooth transitions communicate professionalism while subtle hover effects and loading states provide necessary feedback for business users
- **Hierarchy of Movement**: Priority on form interactions, navigation transitions, and data loading states over decorative animations

## Component Selection
- **Components**: 
  - Cards for business listings and content display
  - Tabs for dashboard navigation
  - Forms with real-time validation for registration
  - Tables for analytics data
  - Dialogs for content creation and editing
  - Avatars for user/business profiles
  - Badges for subscription status and notifications
- **Customizations**: 
  - Custom feed layout component for content discovery
  - Specialized analytics charts using recharts
  - Business profile templates
  - Subscription management interface
- **States**: 
  - Buttons with loading states for form submissions
  - Input fields with validation feedback
  - Toggle states for business features (active/inactive)
  - Loading skeletons for content feeds
- **Icon Selection**: Phosphor icons for consistent weight and professional appearance across all interface elements
- **Spacing**: Consistent 16px base unit with 8px, 16px, 24px, 32px spacing scale for clean layouts
- **Mobile**: 
  - Bottom navigation for mobile users
  - Collapsible sidebar for business dashboard
  - Touch-optimized interaction areas (44px minimum)
  - Progressive disclosure of advanced features
  - Mobile-first responsive design with tablet and desktop enhancements