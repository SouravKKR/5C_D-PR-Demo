# Product Requirement Document (PRD)

## Product Name
**Smart Indoor Navigation System for Campus Using Wi-Fi Zone Localization**

## 1. Overview
The Smart Indoor Navigation System is a mobile-based solution that enables students, faculty, and visitors to navigate inside campus buildings using Wi-Fi router-based localization combined with map-based routing. The system provides Google Maps-style navigation inside buildings without requiring expensive hardware installations.

## 2. Problem Statement
Large campuses with multiple buildings and floors create difficulty for students and visitors in locating classrooms, laboratories, faculty cabins, and offices. Outdoor navigation systems do not provide indoor guidance. Manual signboards are insufficient and confusing. A scalable, low-cost indoor navigation solution is required to improve efficiency and user experience.

## 3. Objectives
- Provide real-time indoor navigation using existing Wi-Fi infrastructure.
- Reduce manual mapping effort for large campuses.
- Offer Google Maps-style route visualization.
- Support multi-building and multi-floor routing.
- Provide accessibility and emergency routing features.

## 4. Target Users
| User Type | Needs |
|---|---|
| Students | Find classrooms, labs, departments |
| Faculty | Locate cabins, meeting rooms |
| Visitors | Navigate buildings easily |
| Admin | Manage maps and router data |

## 5. Product Scope
### Included
- Wi-Fi router-based zone detection
- Indoor routing using graph algorithm
- Multi-floor navigation
- Route visualization with blue path
- Live location updates
- Admin map management
- QR backup positioning

### Not Included
- Crowd prediction
- IoT beacon installation
- AI-based movement prediction
- Outdoor GPS navigation

## 6. System Architecture
```text
Mobile App
   ↓
Wi-Fi Scanner
   ↓
Backend (Spring Boot API)
   ↓
Routing Engine (Dijkstra)
   ↓
PostgreSQL Database
   ↓
Admin Dashboard
```

## 7. Functional Requirements
### 7.1 User Module
- User can detect current location via Wi-Fi.
- User can manually select destination.
- System calculates shortest path.
- App displays route visually.
- App updates position dynamically.
- User can switch floors.
- Accessibility mode available.
- Emergency exit navigation available.

### 7.2 Wi-Fi Localization Module
- System scans available Wi-Fi networks.
- Detect strongest router (BSSID).
- Map router MAC to location node.
- Update location every 3–5 seconds.
- Handle overlapping signals.

### 7.3 Routing Module
- Model building as graph.
- Each Wi-Fi router acts as node.
- Edges define corridor connections.
- Apply Dijkstra’s algorithm.
- Support multi-floor transitions.

### 7.4 Admin Module
- Upload building floor maps.
- Register Wi-Fi routers (MAC address).
- Define router connections.
- Edit node coordinates.
- View usage statistics.

## 8. Non-Functional Requirements
| Category | Requirement |
|---|---|
| Performance | Route calculation < 2 seconds |
| Scalability | Support 6+ buildings |
| Availability | 99% uptime |
| Security | Role-based login |
| Usability | Simple and intuitive UI |

## 9. Technical Stack
| Layer | Technology |
|---|---|
| Mobile App | React Native |
| Backend | Spring Boot |
| Database | PostgreSQL |
| Map Rendering | SVG / Canvas |
| Authentication | JWT |
| Deployment | Railway / Render |

## 10. Database Design (Core Tables)
- `routers(id, mac_address, name, building, floor, x, y)`
- `connections(id, from_router, to_router, distance)`
- `buildings(id, name)`
- `floors(id, building_id, floor_number)`
- `users(id, role, login_details)`

## 11. User Flow
1. User opens app.
2. App scans Wi-Fi networks.
3. Strongest router detected.
4. System identifies current location.
5. User selects destination.
6. Backend calculates route.
7. Blue path displayed on map.
8. Location updates dynamically.

## 12. Success Metrics
- Route accuracy ≥ 85%
- Location detection delay ≤ 5 seconds
- User navigation time reduced
- Successful demo across multiple buildings
