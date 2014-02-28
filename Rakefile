require "rubygems"
require "bundler/setup"
require "stringex"

##############
# Config  #
##############

# Be sure your public key is listed in your server's ~/.ssh/authorized_keys file
ssh_user       = "khealy@kieranhealy.org"
ssh_port       = "22"
document_root  = "~/kieranhealy.org"
rsync_delete   = false
deploy_default = "rsync"

public_dir      = "public"    # compiled site directory

##############
# Deploying  #
##############

desc "Default deploy task"
task :deploy do
  Rake::Task["#{deploy_default}"].execute
end

desc "Deploy website via rsync"
task :rsync do
  exclude = ""
  if File.exists?('./rsync-exclude')
    exclude = "--exclude-from '#{File.expand_path('./rsync-exclude')}'"
  end
  puts "## Deploying website via Rsync"
  ok_failed system("rsync -crzve 'ssh -p #{ssh_port}' #{exclude} #{"--delete" unless rsync_delete == false} #{public_dir}/ #{ssh_user}:#{document_root}")
end

def ok_failed(condition)
  if (condition)
    puts "OK"
  else
    puts "FAILED"
  end
end
