import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#B11116",
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 30,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: "#000",
  },
  childrenContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
});

export default styles;
