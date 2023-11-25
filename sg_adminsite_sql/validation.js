const Joi = require("joi");

/* --------------- Date schema for create a UTC date structure -------------- */
const dateSchema = Joi.string().custom((value, helpers) => {
  const utcDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!value.match(utcDatePattern)) {
    return helpers.error("date.invalid");
  }

  const utcDate = new Date(value);

  if (isNaN(utcDate) || utcDate.toISOString() !== value + "T00:00:00.000Z") {
    return helpers.error("date.utc");
  }

  return value;
}, "UTC Date Validation");

/* ---------------------- User Insert validation schema --------------------- */
exports.usersInsertValidationSchema = Joi.object().keys({
  Username: Joi.string()
    .min(3)
    .max(150)
    .error(new Error("add valid Username"))
    .required(),
  Password: Joi.string().max(150).error(new Error("add Password")).required(),
  RoleId: Joi.number().error(new Error("add user RoleId")).required(),
});

/* ---------------------- User Update validation schema --------------------- */
exports.usersUpdateValidationSchema = Joi.object().keys({
  Username: Joi.string(),
  RoleId: Joi.number(),
  IsActive: Joi.number(),
});

/* ------------------------- User validation Schema ------------------------- */
exports.usersValidationSchema = Joi.object().keys({
  Username: Joi.string()
    .min(3)
    .max(150)
    .error(new Error("add valid Username"))
    .required(),
  Password: Joi.string()
    .max(150)
    .error(new Error("add your Password"))
    .required(),
});

/* --------------------- Game details Validation schema --------------------- */
exports.gameAndGameDetailsValidationSchema = Joi.object().keys({
  Name: Joi.string().error(new Error("add your Game Name")).required(),
  Code: Joi.string().error(new Error("add your Code")).required(),
  Image: Joi.string().empty("").allow(null).optional(),
  DisplayOrder: Joi.number()
    .error(new Error("add your Game DisplayOrder"))
    .required(),
  Description: Joi.string().empty("").allow(null).optional(),
  Rules: Joi.string().allow(null).optional(),
  StreamUrl: Joi.string().error(new Error("add your StreamUrl")).required(),
  IsExposure: Joi.number().error(new Error("add your IsExposure")).required(),
  IsSound: Joi.number().error(new Error("add your IsSound")).required(),
  GameSec: Joi.number().error(new Error("add your GameSec")).required(),
  CardSec: Joi.number().error(new Error("add your CardSec")).required(),
  Status: Joi.number().error(new Error("add your CardSec")).required(),
  HowToPlayUrl: Joi.string().allow(null).optional(),
  Theme: Joi.string().allow(null).optional(),
});

/* ------------------ Game Detials update Valisation schema ----------------- */
exports.gameAndGameDetailsUpdateValidationSchema = Joi.object().keys({
  Name: Joi.string(),
  Code: Joi.string(),
  Image: Joi.string().empty("").allow(null).optional(),
  DisplayOrder: Joi.number(),
  Description: Joi.string().empty("").allow(null).optional(),
  Rules: Joi.string().empty("").allow(null).optional(),
  StreamUrl: Joi.string(),
  IsExposure: Joi.number(),
  IsSound: Joi.number(),
  GameSec: Joi.number(),
  CardSec: Joi.number(),
  IsActive: Joi.number(),
  Status: Joi.number(),
  HowToPlayUrl: Joi.string().empty("").allow(null).optional(),
  Theme: Joi.string().empty("").allow(null).optional(),
});

/* ------------------------ Runner Validation Schema ------------------------ */
exports.runnerValidationSchema = Joi.object().keys({
  GameId: Joi.number().error(new Error("add your GameId")).required(),
  Name: Joi.string().error(new Error("add your Runner Name")).required(),
  BackOdd: Joi.number().error(new Error("add your BackOdd")).required(),
  LayOdd: Joi.number().error(new Error("add your LayOdd")).required(),
  GroupId: Joi.number().error(new Error("add your GroupId")).required(),
  Rcode: Joi.string().error(new Error("add your Rcode")).required(),
});

/* --------------------- Runner Update Validation Schema -------------------- */
exports.runnerUpdateValidationSchema = Joi.object().keys({
  Name: Joi.string(),
  BackOdd: Joi.number(),
  LayOdd: Joi.number(),
  IsActive: Joi.number(),
  GroupId: Joi.number(),
  Rcode: Joi.string(),
});

/* ------------------------- Role Validation Schema ------------------------- */
exports.roleValidationSchema = Joi.object().keys({
  Name: Joi.string().error(new Error("add your Role Name")).required(),
  IsActive: Joi.number(),
});

/* ------------------------- Page Validation Schema ------------------------- */
exports.pageValidationSchema = Joi.object().keys({
  Name: Joi.string().error(new Error("add Page Name")).required(),
  ParentId: Joi.number(),
  DisplayName: Joi.string().error(new Error("add Page DisplayName")).required(),
  DisplayOrder: Joi.number()
    .error(new Error("add Page DisplayOrder"))
    .required(),
  URL: Joi.string().error(new Error("add Page url")).required(),
  Icon: Joi.string().error(new Error("add Page Icon")).required(),
  Role: Joi.number().error(new Error("add Page ROle")).required(),
});

/* ------------------------- Page Validation Schema ------------------------- */
exports.pageUpdateValidationSchema = Joi.object().keys({
  Name: Joi.string(),
  ParentId: Joi.number(),
  DisplayName: Joi.string(),
  DisplayOrder: Joi.number(),
  URL: Joi.string(),
  Icon: Joi.string(),
  IsActive: Joi.number(),
  Role: Joi.number(),
});

/* ---------------------- Permission Validation schema ---------------------- */
exports.permissionValidationSchema = Joi.object().keys({
  RoleId: Joi.number().error(new Error("add RoleId")).required(),
  PageId: Joi.number().error(new Error("add PageId")).required(),
  Action: Joi.number().error(new Error("add Action")).required(),
});

/* ------------------- Udpate permission Validation Schema ------------------ */
exports.permissionUpdateValidationSchema = Joi.object().keys({
  RoleId: Joi.number(),
  PageId: Joi.number(),
  Action: Joi.number(),
  IsActive: Joi.number(),
});

/* ----------------------- Currency Validation schema ----------------------- */
exports.currencyValidationSchema = Joi.object().keys({
  Name: Joi.string().error(new Error("add Currency Name")).required(),
  Code: Joi.string().error(new Error("add Currency Code")).required(),
});

/* -------------------- Currency Udpate validation Schema ------------------- */
exports.currencyUpdateValidationSchema = Joi.object().keys({
  Name: Joi.string(),
  Code: Joi.string(),
  IsActive: Joi.number(),
});

/* ------------------------ Partner Validation Schema ----------------------- */
exports.partnerValidationSchema = Joi.object().keys({
  Name: Joi.string().max(15).error(new Error("add Name")).required(),
  WebsiteUrl: Joi.string()
    .max(100)
    .error(new Error("add WebsiteUrl"))
    .required(),
  IPs: Joi.string().allow(null).optional(),
  BalanceApi: Joi.string()
    .max(250)
    .error(new Error("add BalanceApi"))
    .required(),
  DebitApi: Joi.string().max(250).error(new Error("add DebitApi")).required(),
  CreditApi: Joi.string().max(250).error(new Error("add CreditApi")).required(),
  RollbackApi: Joi.string()
    .max(250)
    .error(new Error("add RollbackApi"))
    .required(),
  Logo: Joi.string().allow(null).optional(),
  AdminShare: Joi.number().error(new Error("add AdminShare")).required(),
  PartnerShare: Joi.number().error(new Error("add PartnerShare")).required(),
  SettlementType: Joi.number()
    .error(new Error("Select SettlementType"))
    .required(),
});

/* -------------------- Partner Update Validation schema -------------------- */
exports.partnerUpdateValidationSchema = Joi.object().keys({
  Name: Joi.string(),
  WebsiteUrl: Joi.string(),
  IPs: Joi.string(),
  BalanceApi: Joi.string(),
  DebitApi: Joi.string(),
  CreditApi: Joi.string(),
  RollbackApi: Joi.string(),
  Logo: Joi.string(),
  AdminShare: Joi.number(),
  PartnerShare: Joi.number(),
  IsActive: Joi.number(),
  SettlementType: Joi.number(),
});

/* ------------------- Partner game Map validation Schema ------------------- */
exports.partnergamemapValidationSchema = Joi.object().keys({
  PartnerId: Joi.number().error(new Error("add PartnerId")).required(),
  GameId: Joi.array().error(new Error("add GameId")).required(),
  MinStake: Joi.number().error(new Error("add MinStake")).required(),
  MaxStake: Joi.number().error(new Error("add MaxStake")).required(),
  MaxProfit: Joi.number().error(new Error("add MaxProfit")).required(),
  DelaySec: Joi.number().error(new Error("add DelaySec")).required(),
});

/* ------------------ Partner Game Updae validation schema ------------------ */
exports.partnergamemapUpdateValidationSchema = Joi.object().keys({
  PartnerId: Joi.number(),
  GameId: Joi.array(),
  MinStake: Joi.number(),
  MaxStake: Joi.number(),
  MaxProfit: Joi.number(),
  DelaySec: Joi.number(),
  IsActive: Joi.number(),
});

/* --------------------------- Game Details Schema -------------------------- */
exports.GameDetailsSchema = Joi.object({
  Code: Joi.string().required(),
});

/* -------------------------- Round Details Schema -------------------------- */
exports.roundDetailsSchema = Joi.object({
  Code: Joi.string().required(),
});

/* -------------------------- Ticket Details Schema ------------------------- */
exports.TicketDetailsSchema = Joi.object({
  ri: Joi.number().required(),
});

/* --------------------------- Ticket Data Schema --------------------------- */
exports.TicketDataSchema = Joi.object({
  tid: Joi.number().required(),
});

/* ------------------------- Get Round Report Schema ------------------------ */
exports.GetRoundReportSchema = Joi.object({
  ri: Joi.number().allow(null).optional(),
  gc: Joi.string().allow(null).optional(),
  fd: dateSchema,
  td: dateSchema,
  pi: Joi.number().required(),
  ps: Joi.number().required(),
  obc: Joi.string().required(),
  sd: Joi.string().required(),
});

/* --------------------- Get Round Details Report Schema -------------------- */
exports.GetRounDetailsdReportSchema = Joi.object({
  ri: Joi.number().required(),
});

/* ----------------------- Get all Partner Validation ----------------------- */
exports.GetPartnerSchema = Joi.object({
  pi: Joi.number().integer().required(),
  ps: Joi.number().integer().required(),
  st: Joi.string().trim().allow(""),
});

/* -------------------- Get All player base on Partner Id ------------------- */
exports.GetPlayerByPartnerId = Joi.object({
  ptid: Joi.string().trim().required(),
  pi: Joi.number().integer().required(),
  ps: Joi.number().integer().required(),
  st: Joi.string().trim().allow(""),
});
