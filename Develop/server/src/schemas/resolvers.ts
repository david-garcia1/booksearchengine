import {User} from '../models/index.js'
import {signToken, AuthenticationError} from '../utils/auth.js';
console.log('hi')

interface UserArgs {
    username: string;
}
interface AddUserArgs {
    input:{
        username:string,
        email: string,
        password:string;
    }
}
interface LoginUserArgs{
    email:string,
    password:string;
}
interface BookArgs{
    input: {
        bookId:string 
    }
}


const resolvers = {
    Query: {
        user: async(_parent:any, {username}:UserArgs) => {
            return User.findOne({username}).populate('savedBooks')
        },
         me: async (_parent: any, _args: any, context: any): Promise<UserArgs | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('could not authenticate user.');
    },
    },
    Mutation: {
        addUser: async(_parent: any, {input}: AddUserArgs) => {
            const user = await User.create({...input});
            const token = signToken(user.username, user.email, user._id);
            return {token, user}
        },

        login: async(_parent:any,{email, password}: LoginUserArgs) => {
            const user = await User.findOne({email});
            if(!user){
                throw new AuthenticationError('could not authenticate user.');

            }
            const correctPw = await  user.isCorrectPassword(password);
            if(!correctPw){
                throw new AuthenticationError('could not authenticate usre.')
            }
            const token = signToken(user.username, user.email, user._id);
            return {token, user}
        },
          saveBook: async (_parent: any, { input }: BookArgs, context: any) => {
            // Check if the user is authenticated
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in');
            }

            // Find and update the user, adding the book to their savedBooks
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id }, // Find the authenticated user
                {
                    $addToSet: { // Prevent duplicate books
                        savedBooks: input, // Add the book directly
                    },
                },
                { new: true } // Return the updated user document
            ).populate('savedBooks'); // Optional: Populate savedBooks if they're references

            // Return the updated user with the newly saved book
            return updatedUser;
        },
   removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in');
      }
      console.log('Context user:', context.user);
      console.log('Removing book with ID:', bookId);
      if (!bookId) {
        throw new Error('bookId is undefined');
      }
      try {
           


        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        ).populate('savedBooks');
        console.log('Updated user after removing book:', updatedUser);
        return updatedUser;
      } catch (error) {
        console.error('Error removing book:', error);
        throw new Error('Failed to remove book');
      }
    },
    },

    }


export default resolvers;