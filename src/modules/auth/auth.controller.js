


const register = async (req, res) => {
    try {
        const newUser = await register(req.body); 
        
        res.status(201).json({ 
            message: "Registration successful", 
            userData: newUser 
        }); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async(req, res)=>{
    const user = await authService.login(req.body)
}

const logout = async(req, res) => {

}

const forgotPassword = async(req, res) => {

}

const changePassword = async(req, res) =>{
    
}