import { Ajax } from 'vap/utils';
Ajax.ignoreEmptyString();
Ajax.SESION(
  '/api-audit/sysinfo',
  '/api-audit/area',
  '/api-audit/single/all/dict_threat_type',
  '/api-audit/single/all/dict_object_type',
  '/api-audit/single/all/dict_police_type',
  '/api-audit/single/all/dict_security_level',
  '/api-audit/single/all/dict_device_type',
  '/api-audit/single/all/dict_website_type',
  '/api-audit/single/all/dict_post_type',
  '/api-audit/single/all/dict_base_sysinfo',
);