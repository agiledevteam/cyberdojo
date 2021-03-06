
require 'erb'

require 'Files'
require 'Folders'
require 'Locking'

class DojoController < ApplicationController
  
  def index
    @title = 'Home'
    @id = id
    @buttons = ['about','basics','donations','faqs','feedback','links','source','tips','why' ]
  end
 
  #------------------------------------------------

  def create
    @languages = Folders::in(root_dir + '/languages').sort    
    @exercises = Folders::in(root_dir + '/exercises').sort
    @instructions = { }
    @exercises.each do |exercise|
      @instructions[exercise] = Exercise.new(root_dir, exercise).instructions
    end
    @title = 'Setup'
  end
  
  #------------------------------------------------

  def save
    info = gather_info
    language = Language.new(root_dir, info[:language])
    exercise = Exercise.new(root_dir, info[:exercise])
    vis = info[:visible_files] = language.visible_files
    vis['output'] = ''
    vis['instructions'] = exercise.instructions
    Kata.create_new(root_dir, info)
    
    redirect_to :action => :index, 
                :id => info[:id]
  end  
  
  #------------------------------------------------
  
  def exists_json
    respond_to do |format|
      format.json {
        render :json => { :exists => Kata.exists?(root_dir, id) }
      }
    end    
  end
  
  #------------------------------------------------

  def start_json
    exists = Kata.exists?(root_dir, id)
    avatar_name = exists ? start_avatar(Kata.new(root_dir, id)) : nil
    full = (avatar_name == nil)
    start_grid = full ? '' : start_avatar_grid(avatar_name)
    respond_to do |format|
      format.json { render :json => {
          :exists => exists,
          :avatar_name => avatar_name,
          :full => full,
          :start_grid => start_grid
        }
      }
    end
  end
  
  #------------------------------------------------

  def start_avatar_grid(avatar_name)
    @avatar_name = avatar_name
    filename = Rails.root.to_s + '/app/views/dojo/start_avatar_grid.html.erb'
    ERB.new(File.read(filename)).result(binding)
  end
  
  #------------------------------------------------
  
  def resume_avatar_grid
    @kata = Kata.new(root_dir, id)    
    @live_avatar_names = @kata.avatar_names
    @all_avatar_names = Avatar.names    
    respond_to do |format|
      format.html { render :layout => false }
    end
  end
  
  #------------------------------------------------

  def full_avatar_grid
    @id = id
    @all_avatar_names = Avatar.names    
  end
  
  #------------------------------------------------
  
  def render_error
    render "error/#{params[:n]}"
  end

  #------------------------------------------------
  
  def start_avatar(kata)
    Locking::io_lock(kata.dir) do
      available_avatar_names = Avatar.names - kata.avatar_names
      if available_avatar_names == [ ]
        avatar_name = nil
      else          
        avatar_name = random(available_avatar_names)
        Avatar.new(kata, avatar_name)
        avatar_name
      end        
    end      
  end
  
  #------------------------------------------------

  def random(array)
    array.shuffle[0]
  end
  
end
