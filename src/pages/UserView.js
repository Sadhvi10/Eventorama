// Imports
import React, { useState , useEffect, useContext} from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Header from '../components/Header';
import { formatMonthDay } from '../utils/formatHelper';
import { db } from '../firebaseConfig';
import { getDoc, doc, updateDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { getAuth, deleteUser } from "firebase/auth";
import {FaAngleDown, FaAngleUp} from 'react-icons/fa';
import {TiUser} from 'react-icons/ti';
import {TbTournament} from 'react-icons/tb';
import {GiTrophy} from 'react-icons/gi'
import { MdDelete } from 'react-icons/md'; 


function UserView() {
  // User code usestates
  const { code } = useParams();
  const { userCode, setUserCode } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const isUser = location.pathname.startsWith('/user/');
  // Navigation usestates
  const navigate = useNavigate();
  // User menu option usestates
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const [isAccountOptionsVisible, setAccountOptionsVisibility] = useState(false);
  // Tournament usestate
  const [tournaments, setTournaments] = useState([]);
  // Active view usestates
  const [view, setView] = useState('home');
  const [activeTab, setActiveTab] = useState('types');

  // Fetch user data from Firestore and update state
  useEffect(() => {
    setUserCode(code);
    const fetchUserData = async () => {
      const userData = await getUserDataFromFirestore(code);
      setUserData(userData);
    };
    fetchUserData();
  }, [code]);

  // Fetch tournaments data from Firestore and render data
  useEffect(() => {
    const fetchTournaments = async () => {
        if (!userCode) return;  // Ensure userCode is defined before proceeding

        const tournamentCollection = collection(db, 'users', userCode, 'tournaments');
        const tournamentSnapshot = await getDocs(tournamentCollection);
        const tournamentList = tournamentSnapshot.docs.map(doc => doc.data());
        setTournaments(tournamentList);
    };

    fetchTournaments();
  }, [userCode]);  // Added userCode as a dependency to re-run the effect if it changes

  // Function to delete tournament
  const handleDeleteTournament = async (tournamentCode) => {
    const confirmation = window.confirm("Do you really want to delete this tournament?");
    if (confirmation) {
        try {
            // 1. Delete the tournament from Firestore
            const tournamentDocRef = doc(db, 'users', code, 'tournaments', tournamentCode);  
            await deleteDoc(tournamentDocRef);
            console.log("Tournament deleted from Firestore.");
    
            // 2. Remove the tournament from the local state
            setTournaments(prevTournaments => prevTournaments.filter(t => t.generatedCode !== tournamentCode));
    
        } catch (error) {
            console.error("Error during tournament deletion:", error);
        }
    }
  };

  // Function to delete user account
  const handleDeleteAccount = async () => {
    const confirmation = window.confirm("Do you really want to delete your account?");
    if (confirmation) {
      try {
        // 1. Delete user data from Firestore
        const userDocRef = doc(db, 'users', code); 
        await deleteDoc(userDocRef);
        console.log("User data deleted from Firestore.");
  
        // 2. Delete user's authentication record 
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          await deleteUser(user);
          console.log("User's authentication record deleted.");
        }
  
        // Redirect to a safe location, e.g., the app's landing page
        navigate('/');
  
      } catch (error) {
        console.error("Error during account deletion:", error);
      }
    }
  };

  // Function to change tab in the home of user view page
  const changeTab = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle logout and redirect to CommonView
  const handleLogout = () => {
    navigate('/');  // Navigate to the root (assuming CommonView is at '/')
  };


  const toggleDropdown = () => {
    setDropdownVisibility(prevState => !prevState);
  };

  const toggleAccountOptions = () => {
    setAccountOptionsVisibility(prevState => !prevState);
  };


  // Function to update lastActivity timestamp
  const updateLastActivity = async (code) => {
    try {
        const userRef = doc(db, 'users', code);
        await updateDoc(userRef, {
            lastActivity: new Date()
        });
        console.log('User last activity updated in Firestore.');
    } catch (error) {
        console.error('Error updating user last activity:', error);
    }
  };

  const handleSomeUserAction = () => {
    // After the action is completed, update the lastActivity timestamp
    updateLastActivity(code);
  };

  const getUserDataFromFirestore = async (code) => {
    try {
      const docRef = doc(db, 'users', code);
      const userSnapshot = await getDoc(docRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log('User data fetched from Firestore:', userData);
        return userData;
      } else {
        console.log('User data not found in Firestore.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  return (
    <div className='flex flex-col min-h-screen space-y-8 text-white bg-black font-inter'>
      {/* Header Information */}
      <Header/>

      <div className='flex flex-row items-center justify-between shadow-xl bg-green-800 p-10 text-yellow-200'>

        {/* Navigation Links */}
        <div className='flex space-x-4 mt-4'>
          <Link to="#" className='font-medium text-xl hover:text-yellow-300 tracking-wider' onClick={() => setView('home')}>Home</Link>
          <Link to="#" className='font-medium text-xl hover:text-yellow-300 tracking-wider' onClick={() => setView('tournament')}> 
            <div className='flex flex-row'>
              <TbTournament className='w-6 h-6 pr-1'/>
              <p>Tournaments</p>
            </div>
          </Link>
        </div>

        {/* User Dropdown */}
        <div className="relative inline-block text-left">
          <div className='mt-4'>
            <button type="button" className="flex items-center space-x-1 rounded text-xl text-yellow-200 hover:text-yellow-300" onClick={toggleDropdown}>
              <TiUser className="w-6 h-6" onClick={handleSomeUserAction} />
              <span onClick={handleSomeUserAction}>{code}</span>
              {isDropdownVisible ? <FaAngleUp className="w-5 h-5" /> : <FaAngleDown className="w-5 h-5" />}
            </button>
          </div>
          {/* Dropdown content */}
          {isDropdownVisible && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-black text-yellow-200">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <Link to="#" onClick={() => setView('home')} className="block px-4 py-2 hover:bg-yellow-300 hover:text-black">Home</Link>
              <Link to="#" onClick={() => setView('tournament')} className="block px-4 py-2 hover:bg-yellow-300 hover:text-black"> Tournaments</Link>
              {/* <Link to="#" onClick={() => setView('event')} className="block px-4 py-2 hover:bg-yellow-300 hover:text-black">Events</Link> */}
              {isUser && (<button onClick={toggleAccountOptions} className="block flex flex-row items-center space-x-2 w-full text-left px-4 py-2 hover:bg-yellow-300 hover:text-black">
              <span>Account</span>
              {isAccountOptionsVisible ? <FaAngleUp className="w-4 h-4" /> : <FaAngleDown className="w-4 h-4" />}
              </button>)}
              {isAccountOptionsVisible && (
                <div className="pl-4 border-l border-yellow-500">
                  {isUser && (<Link to="#" onClick={handleDeleteAccount} className="block px-4 py-2 hover:bg-yellow-300 hover:text-black">Delete Account</Link>)}
                  {isUser && (<Link to="/" onClick={handleLogout} className="block px-4 py-2 hover:bg-yellow-300 hover:text-black">Logout</Link>)}
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Conditional rendering based on the view */}

      {/* Home view */}
      {view === 'home' && (
      <div className="container mx-auto">
        <div className="flex justify-around border-b-2 border-yellow-300 text-yellow-200 font-semibold ">
          <button
            className={`tab-button p-4 ${activeTab === 'tournament' ? 'bg-yellow-200 text-black' : ''}`}
            onClick={() => changeTab('tournament')}
          >
            Inside the Tournament Page
          </button>
          <button
            className={`tab-button p-4 ${activeTab === 'user' ? 'bg-yellow-200 text-black' : ''}`}
            onClick={() => changeTab('user')}
          >
            Inside the User View Page
          </button>
          <button
            className={`tab-button p-4 ${activeTab === 'types' ? 'bg-yellow-200 text-black' : ''}`}
            onClick={() => changeTab('types')}
          >
            Tournament Types and Sports Categories
          </button>
        </div>
  
        {/* Content for Inside the Tournament Page */}
        <div className={`${activeTab !== 'tournament' ? 'hidden' : ''}`}>
          <div className='flex flex-row items-center justify-between p-12 space-x-4 '>
            <div className='bg-green-800 text-yellow-200 w-1/3 text-sm shadow-xl hover:scale-110 transition-transform duration-500 ease-in'>
            <h3 className='font-semibold font-playfair text-xl bg-yellow-200 text-black tracking-wider p-6 text-center'>Add, Edit, or Delete Participants:</h3>
            <p className='p-12'>
                The tournament page serves as the central hub for managing participants. 
                Here, organizers can seamlessly add new participants to the tournament. 
                But flexibility doesn't stop at just adding participants; organizers also have 
                the option to edit participant details or even remove them from the tournament if needed.
            </p>
            </div>

            <div className='bg-green-800 text-yellow-200 w-1/3 text-sm shadow-xl hover:scale-110 transition-transform duration-500 ease-in'>
            <h3 className='font-semibold font-playfair text-xl bg-yellow-200 text-black tracking-wider p-6 text-center'>Edit Tournament Details/Form:</h3>
            <p className='p-12'>
                Organizers aren't locked into their initial settings. 
                The tournament page offers the ability to edit various tournament details, 
                ranging from the name and description to the game name and scheduling. 
                This ensures that any last-minute changes or corrections can be accommodated.
            </p>
            </div>

            <div className='bg-green-800 text-yellow-200 w-1/3 text-sm shadow-xl hover:scale-110 transition-transform duration-500 ease-in'>
            <h3 className='font-semibold font-playfair text-xl bg-yellow-200 text-black tracking-wider p-6 text-center'>View Tournament Brackets:</h3>
            <p className='p-12'>
                The tournament page also features a real-time bracket system where organizers 
                and participants can see the tournament structure. 
                The brackets automatically update to include participants and display 
                one-versus-one matches in case of a single elimination tournament and display the winner in the final round. 
            </p>
            </div>
          </div>
        </div>
  
        {/* Content for Inside the User View Page */}
        <div className={`${activeTab !== 'user' ? 'hidden' : ''}`}>
          <div className='flex flex-row items-center justify-between p-12 space-x-4 '>
            <div className='bg-green-800 text-yellow-200 w-1/2 text-sm shadow-xl hover:scale-110 transition-transform duration-500 ease-in'>
            <h3 className='font-semibold font-playfair text-xl bg-yellow-200 text-black tracking-wider p-6 text-center'>Account Management:</h3>
            <p className='p-12'>
                User autonomy is a cornerstone of our platform. 
                From the user view page, users can either delete their account entirely 
                or simply log out, providing full control over their participation on the platform.
            </p>
            </div>

            <div className='bg-green-800 text-yellow-200 w-1/2 text-sm shadow-xl hover:scale-110 transition-transform duration-500 ease-in'>
            <h3 className='font-semibold font-playfair text-xl bg-yellow-200 text-black tracking-wider p-6 text-center'>Create Tournaments or Events:</h3>
            <p className='p-12'>
                Not just a participant? The user view page also offers the functionality 
                to create new tournaments or events. 
                This means that any user can transition from being a participant to an organizer, 
                thereby fostering a dynamic and engaging community.
            </p>
            </div>
          </div>
        </div>
  
        {/* Content for Tournament Types and Sports Categories */}
        <div className={`${activeTab !== 'types' ? 'hidden' : ''}`}>
          <div className='flex flex-row items-center justify-between p-12 space-x-4 '>
            <div className='bg-green-800 text-yellow-200 w-1/2 text-sm shadow-xl hover:scale-110 transition-transform duration-500 ease-in'>
            <h3 className='font-semibold font-playfair text-xl bg-yellow-200 text-black tracking-wider p-6 text-center'>Types of Tournaments:</h3>
            <p className='p-12'>
                  The platform supports various formats to suit different competitive needs, 
                  including single elimination tournaments that can accommodate 2, 4, 8, 16, or more participants. 
                  For those seeking more complexity and drama, double elimination tournaments are also available.
            </p>
            </div>

            <div className='bg-green-800 text-yellow-200 w-1/2 text-sm shadow-xl hover:scale-110 transition-transform duration-500 ease-in'>
            <h3 className='font-semibold font-playfair text-xl bg-yellow-200 text-black tracking-wider p-6 text-center'>Sports Categories:</h3>
            <p className='p-12'>
                  We recognize the diversity in the competitive landscape, which is why our platform 
                  is not limited to just one type of sport. 
                  Whether you're into e-sports or more traditional, class-related sports, 
                  our platform has got you covered.
            </p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Tournament view  */}
      {view === 'tournament' && (
      <div className='p-4 space-y-4'>
        {/* Display tournaments created by the user */}
        <p className='text-xl text-yellow-200 font-bold'>Your Tournaments:</p>
        {/* Placeholder for tournaments list */}
        <div className="text-black shadow-lg space-y-4">
          {tournaments.map(tournament => (
          <div key={tournament.generatedCode} className="bg-yellow-300 shadow-xl space-y-4 p-2">
            <Link to={{
              pathname: `/tournament/${tournament.generatedCode}`,
              state: {tournamentDetails : tournament}
            }} key={tournament.generatedCode} className="block">
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-row items-center space-x-2'>
                <GiTrophy className='w-6 h-6'/>
                  <div>
                    <h3 className='font-bold tracking-wide'>{tournament.tournamentName}</h3>
                    <p>{tournament.description}</p>
                  </div>
              </div>
              <div className='flex flex-row items-center space-x-2'>
                <p className='font-semibold'>{formatMonthDay(tournament.startTime)}</p>
                {isUser && (<MdDelete className="w-6 h-6 cursor-pointer text-black hover:text-red-700" onClick={() => handleDeleteTournament(tournament.generatedCode)} />)}
              </div>
            </div>
            </Link>
          </div>
          ))}
        </div>
        {isUser && (<button onClick={() => navigate('/tournaments/new')} className="mt-4 bg-green-800 px-3 py-2 text-yellow-200hover:bg-green-700 hover:text-yellow-300 font-medium rounded">Create Tournament</button>)}
      </div>
      )}

    </div>
  );
}

export default UserView;




