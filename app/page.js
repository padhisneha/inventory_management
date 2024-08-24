'use client';

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import Image from 'next/image';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  maxHeight: '80vh',
  overflowY: 'auto',
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const suggestRecipes = async () => {
    const availableItems = inventory.map(item => item.name.toLowerCase());

    // API integration with Spoonacular API for recipe suggestions
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients`, {
      params: {
        ingredients: availableItems.join(','),
        number: 5,
        apiKey: apiKey
      }
    }
    );
    setRecipes(response.data);
  };

  const getRecipeDetails = async (id) => {
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`, {
      params: {
        apiKey: apiKey
      }
    }
    );
    setRecipeDetails(response.data);
    setRecipeModalOpen(true);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRecipeModalClose = () => setRecipeModalOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      flexDirection={'column'}
      alignItems={'flex-start'}
      padding={4}
      bgcolor={"#000"}
      color={"#fff"}
      overflow="auto"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Box display="flex" alignItems="center" gap={2}>
          {/* <Image
            src="/logo.jpg"
            alt="Pantry Management Logo"
            width={70}
            height={50}
          /> */}
          <Typography variant="h4" fontWeight="bold">
            Pantry Management
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              bgcolor: 'black',
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'gray',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              width: '300px',
            }}
          />
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'gray',
              }
            }}
          >
            Add Item
          </Button>
          <Button
            variant="contained"
            onClick={suggestRecipes}
            sx={{
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'gray',
              }
            }}
          >
            Suggest Recipe
          </Button>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box display="flex" width="100%" gap={4} marginTop={4}>
        <Box flex={1} padding={2} bgcolor={'#333'} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h5" marginBottom={2}>
            Pantry Items
          </Typography>
          <Stack spacing={2}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                padding={2}
                display="flex"
                justifyContent="space-between"
                bgcolor={'#000'}
                borderRadius={2}
              >
                <Typography variant="h6">{name}</Typography>
                <Typography variant="h6">Quantity: {quantity}</Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box flex={1} padding={2} bgcolor={'#222'} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h5" marginBottom={2}>
            Recipes
          </Typography>
          <Stack spacing={2}>
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <Box
                  key={recipe.id}
                  padding={2}
                  bgcolor={'#333'}
                  borderRadius={2}
                  onClick={() => getRecipeDetails(recipe.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="h6">{recipe.title}</Typography>
                  <Typography>Used Ingredients: {recipe.usedIngredients.map(ing => ing.name).join(', ')}</Typography>
                  <Typography>Missing Ingredients: {recipe.missedIngredients.map(ing => ing.name).join(', ')}</Typography>
                </Box>
              ))
            ) : (
              <Typography>No matching recipes found.</Typography>
            )}
          </Stack>
        </Box>
      </Box>

      <Modal
        open={recipeModalOpen}
        onClose={handleRecipeModalClose}
        aria-labelledby="recipe-modal-title"
        aria-describedby="recipe-modal-description"
      >
        <Box sx={style}>
          {recipeDetails ? (
            <>
              <Typography id="recipe-modal-title" variant="h6" component="h2">
                {recipeDetails.title}
              </Typography>
              <Image
                src={recipeDetails.image}
                alt={recipeDetails.title}
                width={500}
                height={300}
                layout="responsive"
              />
              <Typography variant="body1" marginTop={2}>
                
                <Typography><strong>Total Cook Time: </strong>{recipeDetails.readyInMinutes} min</Typography>
              </Typography>
              <Typography variant="body1" marginTop={2}>
                <strong>Ingredients:</strong>
              </Typography>
              <ul>
                {recipeDetails.extendedIngredients.map((ing, index) => (
                  <li key={index}>{ing.original}</li>
                ))}
              </ul>
              <Typography variant="body1" marginTop={2}>
                <strong>Instructions:</strong>
              </Typography>
              <Typography variant="body2" component="div">
                {recipeDetails.instructions
                  ? recipeDetails.instructions
                  : "No instructions available."}
              </Typography>
              <Typography variant="body1" marginTop={2}>
                <strong>Nutrition:</strong>
              </Typography>
              <Typography variant="body2" component="div">
                {recipeDetails.nutrition
                  ? `Calories: ${recipeDetails.nutrition.nutrients.find(nutrient => nutrient.name === 'Calories').amount} kcal`
                  : "No nutrition information available."}
              </Typography>
            </>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

