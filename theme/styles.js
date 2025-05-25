// theme/styles.js
import { StyleSheet } from 'react-native';
import colors from './colors';
import metrics from './metrics';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: metrics.gutter,           // screen padding
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: metrics.gutter * 1.5,
    textAlign: 'center',               // center all headers
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radius,
    padding: metrics.gutter,           // consistent card padding
    marginBottom: metrics.gutter,
    alignItems: 'stretch',             // make children fill width
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radius,
    paddingHorizontal: metrics.gutter,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: metrics.gutter,
    width: '100%',                     // inputs always full-width
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: metrics.radius,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: metrics.gutter / 2,
    width: '100%',                     // buttons always full-width
  },
  buttonSecondary: {
    backgroundColor: colors.accent,
    borderRadius: metrics.radius,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: metrics.gutter / 2,
    width: '100%',                     // buttons always full-width
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.surface,
  },
});