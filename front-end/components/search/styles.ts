import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
container: 
{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
},
searchContainer: 
{
    flexDirection: 'row',
    alignItems: 'center', 
    flex: 1,
},
icon: 
{
    marginRight: 15,
    marginLeft: 10,
},
input: 
{
    flex: 1,
    fontSize: 16,
},
button: 
{
    marginLeft: 10,
}
});

export default styles;
