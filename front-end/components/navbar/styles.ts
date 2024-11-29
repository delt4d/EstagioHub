import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#666666',
    flexDirection: 'row',
  },
  navContainer: {
    width: 298,
    backgroundColor: '#666666',
  },
  header: {
    padding: 10,
    backgroundColor: '#666666',
    alignItems: 'center',
  },
  logo: {
    width: 190,
    height: 90,
    resizeMode: 'contain',
  },
  menu: {
    flex: 1,
    backgroundColor: '#666666',
  },
  menuItem: {
    backgroundColor: 'transparent',
    
  },
  menuItemActive: {
    backgroundColor: '#4d4d4d',
  },
  menuTitle: {
    color: 'white',
  },
  footer: {
    paddingBottom: 0,
    backgroundColor: '#666666',
  },
  footerItem: {
    backgroundColor: '#666666',
  },
  footerName: {
    color: 'white',
    fontWeight: 'bold',
  },
  footerEmail: {
    color: 'white',
  },
});

export default styles;
