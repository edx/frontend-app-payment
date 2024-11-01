const DEFAULT_LOOKUP_VALUE = '*';

// enums cause noo-shadow errors in prospectus
export const BaseTagularVariant = {
  Courses: 'courses',
};

const TagularVariant = {
  // Include base/x-ref things
  ...BaseTagularVariant,
  // Supplied from Data Team
  XSeries: 'certificates-xseries',
  ProfessionalCertificate: 'certificates-prof-cert',
  ExecEd: 'certificates-exec-ed',
  MicroBachelors: 'certificates-micro-bachelors',
  MicroMasters: 'certificates-micro-masters',
  Bachelors: 'degrees-bachelors',
  Masters: 'degrees-masters',
  Doctorate: 'degrees-doctorate',
  Bootcamps: 'bootcamps',
  // Not Final
  Certificates: 'degrees-certificates',
  Licenses: 'degrees-licenses',
  // Special Values
  All: 'all-products/mixed',
  Unknown: BaseTagularVariant.Courses,
};

const typeToVariant = {
  [DEFAULT_LOOKUP_VALUE]: TagularVariant.Unknown, // missing value
  // type_attr Slugs
  bachelors: TagularVariant.Bachelors,
  masters: TagularVariant.Masters,
  microbachelors: TagularVariant.MicroBachelors,
  micromasters: TagularVariant.MicroMasters,
  'professional-certificate': TagularVariant.ProfessionalCertificate,
  // 'professional-program-wl': TagularVariant.Unknown, Whitelabel Programs are no more.
  xseries: TagularVariant.XSeries,
  doctorate: TagularVariant.Doctorate,
  license: TagularVariant.Licenses,
  certificate: TagularVariant.Certificates,
  // type_attr Display Names
  Bachelors: TagularVariant.Bachelors,
  Masters: TagularVariant.Masters,
  MicroBachelors: TagularVariant.MicroBachelors,
  MicroMasters: TagularVariant.MicroMasters,
  'Professional Certificate': TagularVariant.ProfessionalCertificate,
  // 'Professional Program': TagularVariant.Unknown, Whitelabel Programs are no more.
  XSeries: TagularVariant.XSeries,
  Doctorate: TagularVariant.Doctorate,
  License: TagularVariant.Licenses,
  Certificate: TagularVariant.Certificates,
  // course_type Slugs
  'executive-education-2u': TagularVariant.ExecEd,
  'bootcamp-2u': TagularVariant.Bootcamps,
  // Skipped as it was a note in the doc: 'Anything else': TagularVariant.Courses,
  // course_type Display Name
  'Executive Education': TagularVariant.ExecEd,
  'Boot Camp': TagularVariant.Bootcamps,
  Course: TagularVariant.Courses,
};

export default function translateVariant(x) {
  return typeToVariant[x] || typeToVariant[DEFAULT_LOOKUP_VALUE];
}
