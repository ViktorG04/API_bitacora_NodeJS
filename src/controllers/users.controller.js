import { getConnection, querys } from "../database";
import { sendEmailAppService } from "./notificacion"
import bcrypt from "bcryptjs";

//list users
export const getUsers = async(req, res) =>{
  try {
    const connection = await getConnection();
    const result = await connection.request()
      .input("id", 0)
      .input("A", "LEB")
      .query(querys.listEEPS);
    res.json(result.recordset);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//insert employee
export const createNewUser = async (req, res) => {
  const { nombre, dui, correo, idRol } = req.body;

  //const
  const idE = 1;
  const idEm = 1;

  var idR, user, passRandom, pass, result, mensaje;

  idR = parseInt(idRol);

  if (nombre == "" || dui == "" || correo == "" || isNaN(idR)) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  //validate docIdentity
  result = await ValidarCampo(dui, "D");
  if (result['V'] != 0) {
    return res.status(400).json({ msg: "Bad Request. please enter a different DUI" });
  }

  //validate correo
  result = await ValidarCampo(correo, "C");
  if (result['V'] != 0) {
    return res.status(400).json({ msg: "Bad Request. please enter a different Email" });
  }

  //user by correo
  user = correo.split("@");
  user = user[0];

  //password random and encrypt
  passRandom = Math.random().toString(36).slice(-8);
  pass = bcrypt.hashSync(passRandom, 8);
  
  //insert users
  result = await IUEmployee(0, "I", user, correo, pass, nombre, dui, idR, idEm, idE);
  if (result == null) {
    return res.status(400).json({ msg: "Bad Request. error creating user" });
  }
  res.json(result);

  mensaje = "Nuevo usuario creado para"+correo+" y password: "+passRandom
  sendEmailAppService("Usuario Creado!", correo, mensaje);
};


//update Employee
export const updateUserById = async (req, res) => {
  const { idUsuario, nombre, dui, correo, idRol, password } = req.body;

  var idU, idR, pass, result, user, mensaje;

  idU = parseInt(idUsuario);
  idR = parseInt(idRol);

  if ( isNaN(idU) || isNaN(idR) || nombre == "" || dui == "" || correo == "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  //compare if new docIdentity and email
  result = await ValidarCampo(idU, 'B');

  if(password !=""){
    if(password.length < 8 || password.length >12){
      return res.status(400).json({ msg: "Bad Request. please password length between 8 and 12 chars" });
    }
    //password encrypt
    pass = bcrypt.hashSync(password, 8);

  }else{
    pass = result['pass'];
  }
 
  if(dui != result['docIdentidad'] & correo != result['dcorreo'] ){
    //validate docIdentity
    result = await ValidarCampo(dui, "D");
    if (result['V'] != 0) {
      return res.status(400).json({ msg: "Bad Request. please enter a different DUI" });
    }
    //validate correo
    result = await ValidarCampo(correo, "C");
    if (result['V'] != 0) {
      return res.status(400).json({ msg: "Bad Request. please enter a different Correo" });
    }
  }

  //user by correo
  user = correo.split("@");
  user = user[0];

  //call update
  result = await IUEmployee(idU,'U',user,correo,pass,nombre, dui,idR);
  
  res.json({ result});

  if(password !="" & result != null){
    mensaje = "Su nueva contraseña es: "+password+" favor ingresar al siguiente link para ingresar"
    sendEmailAppService("Password Actualizado!", correo, mensaje);
  }
};


//validate doc identity and email
async function ValidarCampo(valor, Action) {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input("A", Action)
      .input("var", valor)
      .query(querys.validateDocandEmail);
    return result.recordset[0];
  } catch (error) {
    error.message;
  }
}

//insert or update in db
async function IUEmployee(id, A, U, Co, Pas, Nm, D, R, Em, E) {
  try {
    const connection = await getConnection();
    await connection
      .request()
      .input("id", id)
      .input("A", A)
      .input("user", U)
      .input("co", Co)
      .input("pas", Pas)
      .input("nom", Nm)
      .input("doc", D)
      .input("rol", R)
      .input("em", Em)
      .input("est", E)
      .query(querys.getEmployee);
    var msg = "fields affected";
    return (msg );
  } catch (error) {
    console.error(error);
  }
};