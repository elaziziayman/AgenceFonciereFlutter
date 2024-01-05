import 'package:flutter/material.dart';
import 'package:agence_fonciere/models/User.dart';
import 'package:agence_fonciere/helpers/sqlhelper.dart';

class Register extends StatefulWidget {
  const Register({Key? key}) : super(key: key);

  @override
  State<Register> createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  String _selectedRole = 'Agent Cartographique';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Inscription'),
        backgroundColor: Colors.indigo,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildHeader(),
              _buildTextField('Nom utilisateur', _usernameController),
              SizedBox(height: 20),
              _buildTextField('Mot de passe', _passwordController, obscureText: true),
              SizedBox(height: 20),
              _buildTextField('Confirmer le mot de passe', _confirmPasswordController, obscureText: true),
              SizedBox(height: 20),
              _buildRoleDropdown(),
              SizedBox(height: 20),
              _buildRegisterButton(),
            ],
          ),
        ),
      ),
    );
  }


  Widget _buildHeader() {
    return Column(
      children: [
        Text(
          'Créez votre compte',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Color(0xFF012E46),
          ),
        ),
        SizedBox(height: 8),
        Text(
          'Inscrivez-vous pour accéder à toutes les fonctionnalités',
          style: TextStyle(
            fontSize: 16,
            color: Colors.grey,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, {bool obscureText = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Color(0xFF012E46),
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        TextField(
          controller: controller,
          obscureText: obscureText,
          decoration: InputDecoration(
            hintText: label,
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide.none,
            ),
            contentPadding: EdgeInsets.symmetric(vertical: 14, horizontal: 16),
          ),
        ),
      ],
    );
  }

  Widget _buildRoleDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Rôle',
          style: TextStyle(
            color: Color(0xFF012E46),
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        DropdownButton<String>(
          value: _selectedRole,
          items: ['Agent Cartographique', 'Superviseur']
              .map((role) => DropdownMenuItem(
            value: role,
            child: Text(role),
          ))
              .toList(),
          onChanged: (value) {
            setState(() {
              _selectedRole = value!;
            });
          },
        ),
      ],
    );
  }

  Widget _buildRegisterButton() {
    return ElevatedButton(
      onPressed: () {
        _registerUser();
      },
      style: ElevatedButton.styleFrom(
        primary: Color(0xFF012E46),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
        padding: EdgeInsets.symmetric(vertical: 16),
      ),
      child: Text(
        'S\'inscrire',
        style: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
  void _registerUser() async {
    // Extracting user input
    String username = _usernameController.text.trim();
    String password = _passwordController.text;
    String confirmPassword = _confirmPasswordController.text;

    // Validate username
    if (username.isEmpty) {
      _showErrorDialog('Nom utilisateur ne peut pas être vide');
      return;
    }

    // Validate password
    if (password.isEmpty) {
      _showErrorDialog('Mot de passe ne peut pas être vide');
      return;
    }

    // Validate password confirmation
    if (confirmPassword.isEmpty) {
      _showErrorDialog('Veuillez confirmer le mot de passe');
      return;
    }

    // Check if password and confirmPassword match
    if (password != confirmPassword) {
      _showErrorDialog('Les mots de passe ne correspondent pas');
      return;
    }

    // Other validations can be added here as needed

    // If all validations pass, proceed with user registration
    User newUser = User(
      username: username,
      password: password,
      role: _selectedRole,
    );

    try {
      await SQLHelper.instance.createUser(newUser);
      _showSuccessSnackBar();
      // The user is successfully created in the database.
      // You can navigate to the home screen or perform any other actions.
    } catch (e) {
      // Handle any errors that may occur during user creation.
      print("Error creating user: $e");
    }
  }

  void _showSuccessSnackBar() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Container(
          width: double.infinity, // Takes the full width of the screen
          child: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Inscription réussie',
                  style: TextStyle(color: Colors.green),
                ),
              ),
            ],
          ),
        ),
        backgroundColor: Colors.white,
        duration: Duration(seconds: 3),
        elevation: 6,
        behavior: SnackBarBehavior.floating,
      ),
    ).closed.then((reason) {
      // Navigate back to the login screen after the SnackBar is closed
      Navigator.pop(context);
    });
  }
  void _showErrorDialog(String errorMessage) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Erreur'),
          content: Text(errorMessage),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }

}
