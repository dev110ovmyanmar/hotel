import { ADMIN } from "./constants";

export const PERMISSIONS = {
  // Location
  LOCATION_LIST: "location.list",
  LOCATION_VIEW: "location.view",
  LOCATION_CREATE: "location.create",
  LOCATION_EDIT: "location.edit",

  // Privacy Policy
  PRIVACY_POLICY_LIST: "privacy-policy.list",
  PRIVACY_POLICY_VIEW: "privacy-policy.view",
  PRIVACY_POLICY_CREATE: "privacy-policy.create",
  PRIVACY_POLICY_EDIT: "privacy-policy.edit",

  // Admin & Security
  ADMIN_LIST: "admin.list",
  ADMIN_VIEW: "admin.view",
  ADMIN_CREATE: "admin.create",
  ADMIN_EDIT: "admin.edit",
  ADMIN_PERMISSION: "admin.permission",
  ADMIN_RESET_PASSWORD: "	admin.reset-password",

  //role
  ROLE_LIST: "role.list",
  ROLE_VIEW: "role.view",
  ROLE_CREATE: "role.create",
  ROLE_EDIT: "role.edit",

  //permission
  PERMISSION_LIST: "permission.list",
  PERMISSION_VIEW: "permission.view",
  PERMISSION_CREATE: "permission.create",
  PERMISSION_EDIT: "permission.edit",

  // Settings
  // Property
  PROPERTY_LIST: "property.list",
  PROPERTY_VIEW: "property.view",
  PROPERTY_CREATE: "property.create",
  PROPERTY_EDIT: "property.edit",
  PROPERTY_IMAGE_DOCUMENT: "property.image-document",

  // Policy
  POLICY_LIST: "policy.list",
  POLICY_VIEW: "policy.view",
  POLICY_CREATE: "policy.create",
  POLICY_EDIT: "policy.edit",
  POLICY_DUPLICATE: "policy.duplicate",

  // Country & City Location
  LOCATION_VIEW: "location.view",
  LOCATION_LIST: "location.list",
  LOCATION_CREATE: "location.create",
  LOCATION_EDIT: "location.edit",

  // Privacy Policy
  PRIVACY_POLICY_VIEW: "privacy-policy.view",
  PRIVACY_POLICY_CREATE: "privacy-policy.create",
  PRIVACY_POLICY_EDIT: "privacy-policy.edit",

  // Floor
  FLOOR_LIST: "floor.list",
  FLOOR_VIEW: "floor.view",
  FLOOR_CREATE: "floor.create",
  FLOOR_EDIT: "floor.edit",

  // Amenity
  AMENITY_LIST: "amenity.list",
  AMENITY_VIEW: "amenity.view",
  AMENITY_CREATE: "amenity.create",
  AMENITY_EDIT: "amenity.edit",

  // Room Type
  ROOM_TYPE_LIST: "room-type.list",
  ROOM_TYPE_VIEW: "room-type.view",
  ROOM_TYPE_CREATE: "room-type.create",
  ROOM_TYPE_EDIT: "room-type.edit",
  ROOM_TYPE_AMENITY: "room-type.amenity",
  ROOM_TYPE_UPLOAD: "room-type.upload",

  // Room
  ROOM_LIST: "room.list",
  ROOM_VIEW: "room.view",
  ROOM_CREATE: "room.create",
  ROOM_EDIT: "room.edit",

  // Room Attribute
  ROOM_ATTRIBUTE_LIST: "room-attribute.list",
  ROOM_ATTRIBUTE_VIEW: "room-attribute.view",
  ROOM_ATTRIBUTE_CREATE: "room-attribute.create",
  ROOM_ATTRIBUTE_EDIT: "room-attribute.edit",

  // Room Attribute Value
  ROOM_ATTRIBUTE_VALUE_CREATE: "room-attribute-value.create",
  ROOM_ATTRIBUTE_VALUE_EDIT: "room-attribute-value.edit",

  // Room Rate
  ROOM_RATE_LIST: "room-rate.list",
  ROOM_RATE_VIEW: "room-rate.view",
  ROOM_RATE_CREATE: "room-rate.create",
  ROOM_RATE_EDIT: "room-rate.edit",

  // Category
  CATEGORY_LIST: "category.list",
  CATEGORY_VIEW: "category.view",
  CATEGORY_CREATE: "category.create",
  CATEGORY_EDIT: "category.edit",

  // Unit
  UNIT_LIST: "unit.list",
  UNIT_VIEW: "unit.view",
  UNIT_CREATE: "unit.create",
  UNIT_EDIT: "unit.edit",

  // Meal Plan
  MEAL_PLAN_LIST: "meal-plan.list",
  MEAL_PLAN_VIEW: "meal-plan.view",
  MEAL_PLAN_CREATE: "meal-plan.create",
  MEAL_PLAN_EDIT: "meal-plan.edit",

  // Service
  SERVICE_LIST: "service.list",
  SERVICE_VIEW: "service.view",
  SERVICE_CREATE: "service.create",
  SERVICE_EDIT: "service.edit",

  // Inventory Category 
  // INVENTORY_LIST: "inventory.list",
  // SERVICE_INVENTORY_ITEM_VIEW: "inventory.view",
  // SERVICE_INVENTORY_ITEM_CREATE: "inventory.create",
  // SERVICE_INVENTORY_ITEM_EDIT: "inventory.edit",

  // Service Inventory Item
  SERVICE_INVENTORY_ITEM_LIST: "inventory.list",
  SERVICE_INVENTORY_ITEM_VIEW: "inventory.view",
  SERVICE_INVENTORY_ITEM_CREATE: "inventory.create",
  SERVICE_INVENTORY_ITEM_EDIT: "inventory.edit",

  // Inventory
  SERVICE_INVENTORY_LIST: "service-inventory.list",
  SERVICE_INVENTORY_VIEW: "service-inventory.view",
  SERVICE_INVENTORY_CREATE: "service-inventory.create",
  SERVICE_INVENTORY_EDIT: "service-inventory.edit",
  SERVICE_INVENTORY_DELETE: "service-inventory.delete",

  //Service Packages
  SERVICE_PACKAGE_LIST: "service-package.list",
  SERVICE_PACKAGE_VIEW: "service-package.view",
  SERVICE_PACKAGE_CREATE: "service-package.create",
  SERVICE_PACKAGE_EDIT: "service-package.edit",

  // Payment
  PAYMENT_LIST: "payment.list",
  PAYMENT_VIEW: "payment.view",
  PAYMENT_CREATE: "payment.create",
  PAYMENT_EDIT: "payment.edit",

  // Tax
  TAX_LIST: "tax.list",
  TAX_VIEW: "tax.view",
  TAX_CREATE: "tax.create",
  TAX_EDIT: "tax.edit",

  // Partner
  PARTNER_LIST: "partner.list",
  PARTNER_VIEW: "partner.view",
  PARTNER_CREATE: "partner.create",
  PARTNER_EDIT: "partner.edit",

  // Guest
  GUEST_LIST: "guest.list",
  GUEST_VIEW: "guest.view",
  GUEST_CREATE: "guest.create",
  GUEST_EDIT: "guest.edit",
  GUEST_IMAGE_DOCUMENT: "guest.image-document",

  // Guest Note
  GUEST_NOTE_LIST: "guest-note.list",
  GUEST_NOTE_CREATE: "guest-note.create",
  GUEST_NOTE_EDIT: "guest-note.edit",
  GUEST_NOTE_VIEW: "guest-note.view",

  // Department
  DEPARTMENT_LIST: "department.list",
  DEPARTMENT_VIEW: "department.view",
  DEPARTMENT_CREATE: "department.create",
  DEPARTMENT_EDIT: "department.edit",

  // Staff
  STAFF_LIST: "staff.list",
  STAFF_VIEW: "staff.view",
  STAFF_CREATE: "staff.create",
  STAFF_EDIT: "staff.edit",
  STAFF_IMAGE_UPLOAD: "staff.upload",

  // Facility
  FACILITY_LIST: "facility.list",
  FACILITY_VIEW: "facility.view",
  FACILITY_CREATE: "facility.create",
  FACILITY_EDIT: "facility.edit",

  // Facility Package
  FACILITY_PACKAGE_LIST: "facility-package.list",
  FACILITY_PACKAGE_VIEW: "facility-package.view",
  FACILITY_PACKAGE_CREATE: "facility-package.create",
  FACILITY_PACKAGE_EDIT: "facility-package.edit",

  // Facility Booking
  FACILITY_BOOKING_LIST: "facility-booking.list",
  FACILITY_BOOKING_VIEW: "facility-booking.view",
  FACILITY_BOOKING_CREATE: "facility-booking.create",
  FACILITY_BOOKING_EDIT: "facility-booking.edit",

  // Rate Plan
  RATE_PLAN_LIST: "rate-plan.list",
  RATE_PLAN_VIEW: "rate-plan.view",
  RATE_PLAN_CREATE: "rate-plan.create",
  RATE_PLAN_EDIT: "rate-plan.edit",

  // Seasonal Rate
  SEASONAL_RATE_LIST: "seasonal-rate.list",
  SEASONAL_RATE_VIEW: "seasonal-rate.view",
  SEASONAL_RATE_CREATE: "seasonal-rate.create",
  SEASONAL_RATE_EDIT: "seasonal-rate.edit",

  // Reservation Calendar
  RESERVATION_CALENDAR: "calendar.reservation",

  // Availability Calendar and for room inventory
  AVAILABILITY_CALENDAR_LIST: "availability-calendar.list",
  AVAILABILITY_CALENDAR_VIEW: "availability-calendar.view",
  AVAILABILITY_CALENDAR_CREATE: "availability-calendar.create",
  AVAILABILITY_CALENDAR_EDIT: "availability-calendar.edit",
  AVAILABILITY_CALENDAR_STOP_SELL : "availability-calendar.stop-sell",

  // Availability Calendar
  RATE_AND_INVENTORY_CALENDAR_LIST: "calendar.rate-inventory",
  // AVAILABILITY_CALENDAR_VIEW: "availability-calendar.view",
  // AVAILABILITY_CALENDAR_CREATE: "availability-calendar.create",
  // AVAILABILITY_CALENDAR_UPDATE: "availability-calendar.edit",

  //Supplier
  SUPPLIER_LIST: "supplier.list",
  SUPPLIER_VIEW: "supplier.view",
  SUPPLIER_CREATE: "supplier.create",
  SUPPLIER_EDIT: "supplier.edit",

  //Restaurant Table
  RESTAURANT_TABLE_LIST: "table.list",
  RESTAURANT_TABLE_VIEW: "table.view",
  RESTAURANT_TABLE_CREATE: "table.create",
  RESTAURANT_TABLE_EDIT: "table.edit",

  //F&B Order
  FNB_ORDER_LIST: "fnb-order.list",
  FNB_ORDER_CREATE: "fnb-order.create",
  FNB_ORDER_EDIT: "fnb-order.edit",
  FNB_ORDER_VIEW: "fnb-order.view",
  FNB_ORDER_DELETE: "fnb-order.delete",
  FNB_ORDER_ITEM: "fnb-order.item",

  // Menu Category
  MENU_CATEGORY_LIST: "menu-category.list",
  MENU_CATEGORY_VIEW: "menu-category.view",
  MENU_CATEGORY_CREATE: "menu-category.create",
  MENU_CATEGORY_EDIT: "menu-category.edit",

  // Menu Items
  MENU_ITEM_LIST: "menu.list",
  MENU_ITEM_VIEW: "menu.view",
  MENU_ITEM_CREATE: "menu.create",
  MENU_ITEM_EDIT: "menu.edit",

  // Food and Beverage Inventory
  FOOD_AND_BEVERAGE_INVENTORY_LIST: "fnb-inventory.list",
  FOOD_AND_BEVERAGE_INVENTORY_VIEW: "fnb-inventory.view",
  FOOD_AND_BEVERAGE_INVENTORY_CREATE: "fnb-inventory.create",
  FOOD_AND_BEVERAGE_INVENTORY_EDIT: "fnb-inventory.edit",

  // Menu Modifier 
  MENU_MODIFIER_LIST: "menu.list",
  MENU_MODIFIER_VIEW: "menu.view",
  MENU_MODIFIER_CREATE: "menu.create",
  MENU_MODIFIER_EDIT: "menu.edit",

  // Extra bed rate
  EXTRA_RATE_LIST: "extra-rate.list",
  EXTRA_RATE_VIEW: "extra-rate.view",
  EXTRA_RATE_CREATE: "extra-rate.create",
  EXTRA_RATE_EDIT: "extra-rate.edit",

  //Room restriction
  ROOM_RESTRICTION_LIST: "room-restriction.list",
  ROOM_RESTRICTION_VIEW: "room-restriction.view",
  ROOM_RESTRICTION_CREATE: "room-restriction.create",
  ROOM_RESTRICTION_EDIT: "room-restriction.edit",
  ROOM_RESTRICTION_STOP_SELL:"room-restriction.stop-sell",

  //Reservation 
  RESERVATION_LIST: "reservation.list",
  RESERVATION_VIEW: "reservation.view",
  RESERVATION_CREATE: "reservation.create",
  RESERVATION_SEARCH: "reservation.search",

  //Reservation room
  RESERVATION_ROOM_LIST: "reservation-room.list",
  RESERVATION_ROOM_VIEW: "reservation-room.view",
  RESERVATION_ROOM_CREATE: "reservation-room.create",
  RESERVATION_ROOM_SEARCH: "reservation-room.search",
  RESERVATION_ROOM_NOTE: "reservation-room.note",
  // RESERVATION_ROOM_SEARCH: "reservation-room.search",

  //HouseKeeping Status
  HK_STATUS_LIST: "hk-status.list",
  HK_STATUS_VIEW: "hk-status.view",
  HK_STATUS_EDIT: "hk-status.edit",

  //HouseKeeping Task
  HK_TASK_LIST: "hk-task.list",
  HK_TASK_VIEW: "hk-task.view",
  HK_TASK_CREATE: "hk-task.create",
  HK_TASK_EDIT: "hk-task.edit",

  // HoseKeeping Task Staff Assign
  HK_TASK_ASSIGNMENT_LIST: "hk-task-assignment.list",
  HK_TASK_ASSIGNMENT_CREATE: "hk-task-assignment.create",
  HK_TASK_ASSIGNMENT_VIEW: "hk-task-assignment.view",
  HK_TASK_ASSIGNMENT_EDIT: "hk-task-assignment.edit",
  HK_TASK_ASSIGNMENT_DELETE: "hk-task-assignment.delete",

  //Maintenance Request
  MAINTENANCE_REQUEST_LIST: "maintenance-request.list",
  MAINTENANCE_REQUEST_VIEW: "maintenance-request.view",
  MAINTENANCE_REQUEST_CREATE: "maintenance-request.create",
  MAINTENANCE_REQUEST_EDIT: "maintenance-request.edit",

  //Maintenance Task Assignment
  MAINTENANCE_TASK_ASSIGNMENT_LIST: "maintenance-task-assignment.list",
  MAINTENANCE_TASK_ASSIGNMENT_VIEW: "maintenance-task-assignment.view",
  MAINTENANCE_TASK_ASSIGNMENT_CREATE: "maintenance-task-assignment.create",
  MAINTENANCE_TASK_ASSIGNMENT_EDIT: "maintenance-task-assignment.edit",

  //Reservation
  RESERVATION_ROOM_LIST: "reservation-room.list",
  RESERVATION_EDIT: "reservation.edit",
  RESERVATION_ROOM_OCCUPANCY_VIEW: "reservation-room-occupancy.view",
  RESERVATION_ROOM_AMENDMENT: "reservation-room.amendment",

  // Service Order
  SERVICE_ORDER_LIST: "service-order.list",
  SERVICE_ORDER_CREATE: "service-order.create",
  SERVICE_ORDER_VIEW: "service-order.view",
  SERVICE_ORDER_EDIT: "service-order.edit",

  //Folio
  FOLIO_LIST: "folio.list",
  FOLIO_PRINT: "folio.print",
  FOLIO_EDIT: "folio.edit",
  FOLIO_CREATE: "folio.create",

  //Folio-Lines
  FOLIO_LINE_ADJUST: "folio-line.adjust",
  FOLIO_LINE_REBATE: "folio-line.rebate",
  FOLIO_LINE_VOID: "folio-line.void",
  FOLIO_LINE_TRANSFER: "folio-line.transfer",
  FOLIO_LINE_NEW_POST: "folio-line.new-post",

  //Folio-Payment
  FOLIO_PAYMENT_PAYMENT: "folio-payment.payment",
  FOLIO_PAYMENT_DEPOSIT: "folio-payment.deposit",
  FOLIO_PAYMENT_REFUND: "folio-payment.refund",

  // Payment History (Folio-Payment)
  FOLIO_PAYMENT_LIST: "folio-payment.list",


};


