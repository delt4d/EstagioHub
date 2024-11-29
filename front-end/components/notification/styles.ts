import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FBE3E3',
    borderRadius: 20,
    padding: 12,
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 25,
    marginBottom: 10,
    flex: 1,
  },
  boldText: {
    fontWeight: 'semibold',
    color: '#903638',
  }
});

export default styles;