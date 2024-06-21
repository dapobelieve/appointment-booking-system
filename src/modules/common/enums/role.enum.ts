export enum UserRole {
  MERCHANT = 'MERCHANT',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'admin',
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

/**
 * The different tags used in grouping the API endpoints in the swagger documentation
 */
export enum SwaggerApiTagsEnum {
  DEFAULT = 'Default',
  MERCHANTS = 'MERCHANTS',
  AUTHENTICATION = 'AUTHENTICATION',
  CUSTOMERS = 'CUSTOMERS',
  SCHEDULE_TEMPLATE = 'SCHEDULE TEMPLATE',
  SCHEDULE = 'SCHEDULE',
  APPOINTMENTS = 'APPOINTMENTS',
}
