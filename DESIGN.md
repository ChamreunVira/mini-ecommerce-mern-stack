System & Layout Prompt Template

Role: Senior Frontend & UI/UX Engineer specialized in pixel-perfect dashboard implementations using Tailwind CSS and React/Vue.

Task: Recreate the exact UI design, layout architecture, and visual system shown in the provided specification, ensuring the interface remains 100% structurally identical while accepting dynamic or domain-specific data.

Visual System & Design Tokens (Strict Enforcement):

Background & Surfaces:

Application Background: #F8F9FA (Off-white/light gray).

Main Content Area & Cards: #FFFFFF (Pure white) with a 1px solid #E5E7EB border and zero box-shadow for a flat, modern aesthetic.

Sidebar Background: #F8F9FA matching the app background.

Color Palette & Status Badges:

Active/Primary Navigation Accent: #F1F5F9 gray pill background with dark primary text for the currently selected menu item.

Primary Action Buttons: Solid black #0F172A background with crisp white text (+ Action top right).

Green Status Badges (In Stock, Active, Paid, Delivered): Light green background (#DCFCE7) with bold green text (#15803D).

Red Status/Deleted Elements (Deleted, Inactive, Cancelled): Light red background (#FEE2E2) with bold red text (#DC2626). Red strike-through/faded text for deleted table rows.

Blue Status Badges (Confirmed): Solid teal/blue background (#0284C7) with white text.

Typography & Spacing:

Sans-serif font family (Inter or Plus Jakarta Sans).

Page Titles: Bold, large black heading (text-2xl font-bold text-gray-900) paired with a light sub-description directly underneath (text-sm text-gray-500).

Table Headers: Light gray uppercase/capitalized text (text-xs font-semibold text-gray-600 border-b).

Structural Layout Blueprint (Do Not Alter Structure):

Left Fixed Sidebar (Width: 240px):

Top: Brand Logo/Text ([BRAND_NAME]) in bold, oversized font (text-2xl font-extrabold tracking-tight).

Nav Items: Vertical list with line icons on the left and text labels on the right (Dashboard, Products, Collections, Coupons, Orders, Users, Banners, Settings). Highlight active item with a filled light-gray background block.

Bottom Fixed Section: Dark pill badge (N or brand mark) on the far left, paired with a solid dark full-width Logout button at the very bottom left.

Top Navigation Header Bar:

Left: Collapse sidebar icon.

Right: User Profile Avatar + User Full Name ([USER_NAME]), followed by profile, notification bell, and light/dark theme toggle icons.

Main Workspace:

Top Header Row: Page Title on the left, Subtitle below it, and Primary Action Button (+ Action Button) on the far right.

Page Layout Types (Reusable Data Views):

Type A: Summary / Analytics Dashboard View

4-Card Top Stat Row: Grid of 4 equal-width white metric cards displaying Metric Name, Large Value (text-3xl font-bold), sub-label, and a top-right icon.

Charts Row (2-Column Grid):

Left: Time-series bar/line chart with custom dropdown range selector in the top right (Last 90 days).

Right: Donut chart displaying status distribution with a side legend using colored dots.

Type B: Data Table View (List/Management)

Full-width white table container with top border and subtle horizontal dividers between rows.

Columns: Checkbox select, Item Preview (image/icon + primary text + subtext), Price/Value, Discount/Secondary Metric, Category, Tags/Status, Code/ID (monospaced), Status Pill, and Three-Dot (...) Action menu.

Bottom Pagination: Footer bar showing Showing X to Y of Z results on the left, and Previous 1 Next controls on the right.