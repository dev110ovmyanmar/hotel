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

  // Property
  PROPERTY_LIST: "property.list",
  PROPERTY_VIEW: "property.view",
  PROPERTY_CREATE: "property.create",
  PROPERTY_EDIT: "property.edit",

  // Policy
  POLICY_LIST: "policy.list",
  POLICY_VIEW: "policy.view",
  POLICY_CREATE: "policy.create",
  POLICY_EDIT: "policy.edit",
  POLICY_DUPLICATE: "policy.duplicate",

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

  // Inventory
  SERVICE_INVENTORY_LIST: "service-inventory.list",
  SERVICE_INVENTORY_VIEW: "service-inventory.view",
  SERVICE_INVENTORY_CREATE: "service-inventory.create",
  SERVICE_INVENTORY_EDIT: "service-inventory.edit",

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

  // Availability Calendar
  AVAILABILITY_CALENDAR_LIST: "availability-calendar.list",
  AVAILABILITY_CALENDAR_VIEW: "availability-calendar.view",
  AVAILABILITY_CALENDAR_CREATE: "availability-calendar.create",
  AVAILABILITY_CALENDAR_UPDATE: "availability-calendar.edit",

  // Menu Category
  MENU_CATEGORY_LIST: "menu-category.list",
  MENU_CATEGORY_VIEW: "menu-category.view",
  MENU_CATEGORY_CREATE: "menu-category.create",
  MENU_CATEGORY_EDIT: "menu-category.edit",

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

  // Food and Beverage Inventory
  FOOD_AND_BEVERAGE_INVENTORY_LIST: "fnb-inventory.list",
  FOOD_AND_BEVERAGE_INVENTORY_VIEW: "fnb-inventory.view",
  FOOD_AND_BEVERAGE_INVENTORY_CREATE: "fnb-inventory.create",
  FOOD_AND_BEVERAGE_INVENTORY_EDIT: "fnb-inventory.edit",

  // Menu Item
  MENU_ITEM_LIST: "menu.list",
  MENU_ITEM_VIEW: "menu.view",
  MENU_ITEM_CREATE: "menu.create",
  MENU_ITEM_EDIT: "menu.edit",

  // Extra bed rate
  EXTRA_BED_RATE_LIST: "extra-bed-rate.list",
  EXTRA_BED_RATE_VIEW: "extra-bed-rate.view",
  EXTRA_BED_RATE_CREATE: "extra-bed-rate.create",
  EXTRA_BED_RATE_EDIT: "extra-bed-rate.edit",

  //Room restriction
  ROOM_RESTRICTION_LIST: "room-restriction.list",
  ROOM_RESTRICTION_VIEW: "room-restriction.view",
  ROOM_RESTRICTION_CREATE: "room-restriction.create",
  ROOM_RESTRICTION_EDIT: "room-restriction.edit",
};